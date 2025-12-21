#!/usr/bin/env bun
/**
 * p3g.ts v0.2.0
 * CLI global de gerenciamento de dependências e mini-workspaces
 * Compatível com Windows, Linux e macOS
 * Autor: Suissa 🧠
 */

import { execSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  rmSync,
  cpSync,
  symlinkSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import * as os from 'os';
import kleur from 'kleur';
import readline from 'readline';

// ---------------------
// Configurações globais
// ---------------------
const isWindows = os.platform() === 'win32';
const workspace =
  process.env.p3g_WORKSPACE !== undefined && process.env.p3g_WORKSPACE.trim() !== ''
    ? process.env.p3g_WORKSPACE
    : join(os.homedir(), '.p3g_workspace/js');
const tmpdir = join(os.tmpdir(), `p3g_install_${Date.now()}`);
const presetDir = join(workspace, '..', 'presets');
ensureDir(presetDir);

const args = process.argv.slice(2);
const copyMode = args.includes('--copy') || isWindows; // Force copy mode on Windows by default
const verbose = args.includes('--verbose');
const syncMode = args.includes('sync');
const help = args.includes('--help');
const isDev = args.includes('--dev');
const forceSymlink = args.includes('--symlink'); // Override Windows default

// ---------------------
// Controle de tempo
// ---------------------
let installStartTime = 0;
let uniquePackagesInstalled = 0;

// ---------------------
// Funções de logging
// ---------------------
function log(...msg: unknown[]): void {
  if (verbose) {
    console.log(kleur.cyan('[p3g]'), ...msg);
  }
}
function info(...msg: unknown[]): void {
  console.log(kleur.blue('[p3g]'), ...msg);
}
function warn(...msg: unknown[]): void {
  console.warn(kleur.yellow('[AVISO]'), ...msg);
}
function error(...msg: unknown[]): void {
  console.error(kleur.red('[ERRO]'), ...msg);
}

// ---------------------
// Funções de tempo
// ---------------------
function startTimer(): void {
  installStartTime = Date.now();
}
function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${(ms / 60000).toFixed(1)}min`;
}
function showTimingStats(): void {
  if (installStartTime === 0 || uniquePackagesInstalled === 0) {
    return;
  }

  const totalTime = Date.now() - installStartTime;
  const avgTime = totalTime / uniquePackagesInstalled;

  info(`⏱️  Tempo total: ${kleur.green(formatTime(totalTime))}`);
  info(
    `📊 Média por dependência: ${kleur.cyan(formatTime(avgTime))} (${kleur.gray(String(uniquePackagesInstalled) + ' pacotes únicos')})`,
  );
}

// ---------------------
// Utilitários
// ---------------------
function ensureDir(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}
function pkgDirname(pkg: string, ver: string): string {
  const clean = pkg.replace(/[@/:]/g, '-');
  return `${clean}__${ver}`;
}
function exec(cmd: string, cwd?: string): void {
  try {
    execSync(cmd, { cwd, stdio: 'ignore' });
  } catch {
    error(`Falha ao executar: ${cmd}`);
    process.exit(1);
  }
}
function listDirs(path: string): string[] {
  if (!existsSync(path)) {
    return [];
  }
  return readdirSync(path).filter(f => statSync(join(path, f)).isDirectory());
}

// ---------------------
// Utilitários específicos do Windows
// ---------------------
function canCreateSymlinks(): boolean {
  if (!isWindows) return true;
  
  try {
    // Tenta criar um symlink de teste
    const testDir = join(os.tmpdir(), 'p3g_symlink_test');
    const testTarget = join(os.tmpdir(), 'p3g_symlink_target');
    
    ensureDir(testTarget);
    symlinkSync(testTarget, testDir, 'dir');
    rmSync(testDir, { force: true });
    rmSync(testTarget, { force: true });
    return true;
  } catch {
    return false;
  }
}

function createWindowsBinWrapper(binName: string, targetPath: string): void {
  const binDir = ensureBinDir();
  const cmdFile = join(binDir, `${binName}.cmd`);
  const psFile = join(binDir, `${binName}.ps1`);
  
  // Cria wrapper .cmd para compatibilidade
  const cmdContent = `@echo off
node "${targetPath}" %*`;
  
  // Cria wrapper .ps1 para PowerShell
  const psContent = `#!/usr/bin/env pwsh
& node "${targetPath}" @args`;
  
  writeFileSync(cmdFile, cmdContent);
  writeFileSync(psFile, psContent);
  
  info(`🔗 .bin (Windows): ${kleur.magenta(binName)} → ${kleur.gray(targetPath)}`);
}

// ---------------------
// Atualiza package.json
// ---------------------
function addToPackageJSON(name: string, version: string, isDevDep = false): void {
  const pkgPath = 'package.json';
  let pkg: Record<string, unknown> = {};

  if (existsSync(pkgPath)) {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>;
  } else {
    pkg = { name: 'my-project', version: '1.0.0' };
  }

  const key = isDevDep ? 'devDependencies' : 'dependencies';
  pkg[key] ??= {};
  const deps = pkg[key] as Record<string, string>;
  deps[name] = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  info(`🧾 Adicionado ${kleur.cyan(name)}@${kleur.gray(version)} em ${kleur.yellow(key)}`);
}

function ensureBinDir(): string {
  const bin = 'node_modules/.bin';
  if (!existsSync(bin)) {
    mkdirSync(bin, { recursive: true });
  }
  return bin;
}

function linkPackageBins(pkgName: string, pkgPathInNodeModules: string): void {
  // Lê package.json do pacote linkado/copied
  const pkgJsonPath = join(pkgPathInNodeModules, 'package.json');
  if (!existsSync(pkgJsonPath)) {
    return;
  }

  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8')) as Record<string, unknown>;
  const bin = pkg.bin as string | Record<string, string> | undefined;
  if (bin === undefined) {
    return;
  }

  const binDir = ensureBinDir();
  const entries = typeof bin === 'string' ? { [pkgName]: bin } : bin;

  for (const [binName, relTarget] of Object.entries(entries)) {
    const src = join(pkgPathInNodeModules, String(relTarget));
    if (!existsSync(src)) {
      warn(`Bin não encontrado para ${pkgName}: ${String(relTarget)}`);
      continue;
    }

    if (isWindows) {
      // No Windows, cria wrappers .cmd e .ps1
      createWindowsBinWrapper(binName, src);
    } else {
      // Unix-like: cria symlink tradicional
      const linkName = join(binDir, binName);
      rmSync(linkName, { force: true });

      try {
        symlinkSync(src, linkName);
        info(`🔗 .bin: ${kleur.magenta(binName)} → ${kleur.gray(src)}`);
      } catch {
        warn(`Falha ao linkar .bin para ${pkgName}/${binName}`);
      }
    }
  }
}

// ---------------------
// Instala pacote único
// ---------------------
function handlePkg(raw: string): void {
  let name = raw;
  let version = 'latest';

  if (raw.startsWith('@')) {
    // Suporta "@scope/pkg@ver"
    const at = raw.lastIndexOf('@');
    if (at > 0) {
      name = raw.slice(0, at);
      version = raw.slice(at + 1) || 'latest';
    }
  } else if (raw.includes('@')) {
    const [n, v] = raw.split('@');
    name = n;
    version = v || 'latest';
  }

  // Sanitize só para o nome da pasta no workspace (mantém versão original no package.json)
  const safeVer = version.replace(/[^0-9A-Za-z._-]/g, '_');
  const dir = pkgDirname(name, safeVer);
  const target = join(workspace, dir);
  ensureDir(workspace);

  if (!existsSync(target)) {
    info(`⬇️  Baixando ${name}@${version} com Bun...`);
    const downloadStart = Date.now();
    ensureDir(tmpdir);
    exec(`bun add "${name}@${version}" --no-save`, tmpdir);

    const pkgPath = join(tmpdir, 'node_modules', name);
    if (!existsSync(pkgPath)) {
      error(`Pacote ${name} não encontrado após bun add.`);
      process.exit(1);
    }
    cpSync(pkgPath, target, { recursive: true });
    // cpSync('./bun.lock', target);
    const downloadTime = Date.now() - downloadStart;
    info(`📦 Copiado para ${kleur.green(target)} ${kleur.gray(`(${formatTime(downloadTime)})`)}`);
    uniquePackagesInstalled++;
  } else {
    log(`✅ Encontrado no workspace: ${name}@${version}`);
  }

  ensureDir('node_modules');

  // Para escopos (@scope/pkg), garante o diretório pai do symlink/cópia
  const nodePath = join('node_modules', name);
  const nodeParent = join('node_modules', name.startsWith('@') ? name.split('/')[0] : '');
  if (name.startsWith('@')) {
    ensureDir(nodeParent);
  }

  // Remove o destino anterior
  rmSync(nodePath, { recursive: true, force: true });

  const shouldUseSymlink = !copyMode && (forceSymlink || canCreateSymlinks());

  if (shouldUseSymlink) {
    // Symlink quando possível
    try {
      symlinkSync(target, nodePath, 'dir');
      info(`🔗 Vinculado ${kleur.magenta(nodePath)} → ${kleur.gray(target)}`);
    } catch (err) {
      warn(`Falha ao criar symlink, usando cópia: ${String(err)}`);
      cpSync(target, nodePath, { recursive: true });
      info(`📁 Copiado ${kleur.magenta(name)} → node_modules (fallback)`);
    }
  } else {
    // Modo cópia (padrão no Windows)
    cpSync(target, nodePath, { recursive: true });
    const mode = isWindows ? '(Windows)' : '(--copy)';
    info(`📁 Copiado ${kleur.magenta(name)} → node_modules ${kleur.gray(mode)}`);
  }

  linkPackageBins(name, nodePath);

  hydrateDepsOf(name);
  addToPackageJSON(name, version, isDev);
}

function readPkgJson(dir: string): Record<string, unknown> | null {
  const p = join(dir, 'package.json');
  if (!existsSync(p)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function hydrateDepsOf(name: string): void {
  // procura o pacote já instalado (linkado/copied) no projeto
  const pkgDir = join('node_modules', name);
  const pkg = readPkgJson(pkgDir);
  if (pkg === null) {
    warn(`Não achei package.json de ${name} para hidratar.`);
    return;
  }

  // só dependências diretas
  const pkgDeps =
    pkg.dependencies !== undefined ? (pkg.dependencies as Record<string, string>) : {};
  const direct = { ...pkgDeps };
  const entries = Object.entries(direct);
  if (entries.length === 0) {
    log(`Sem deps diretas para ${name}.`);
    return;
  }

  info(`💧 Hidratando deps diretas de ${name}: ${entries.length} pacote(s)`);
  for (const [depName, depVer] of entries) {
    handlePkg(`${depName}@${String(depVer)}`);
  }
}

// ---------------------
// Salvar miniworkspace
// ---------------------
async function askSavePreset(): Promise<void> {
  const pkgPath = 'package.json';
  if (!existsSync(pkgPath)) {
    return;
  }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise<void>(resolve => {
    rl.question('Deseja salvar estas dependências como miniworkspace? (y/n) ', ans => {
      if (ans.toLowerCase() !== 'y') {
        return (rl.close(), resolve());
      }
      rl.question('Nome do miniworkspace: ', name => {
        const path = join(presetDir, `${name}.json`);
        const deps =
          pkg.dependencies !== undefined ? (pkg.dependencies as Record<string, string>) : {};
        const devDeps =
          pkg.devDependencies !== undefined ? (pkg.devDependencies as Record<string, string>) : {};
        const data = {
          name,
          dependencies: deps,
          devDependencies: devDeps,
        };
        writeFileSync(path, JSON.stringify(data, null, 2));
        info(`✅ Miniworkspace "${name}" salvo em ${kleur.gray(path)}`);
        rl.close();
        resolve();
      });
    });
  });
}

// ---------------------
// Usar miniworkspace
// ---------------------
function usePreset(name: string): void {
  const path = join(presetDir, `${name}.json`);
  if (!existsSync(path)) {
    return error(`Miniworkspace "${name}" não encontrado.`);
  }
  const preset = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
  info(`🧠 Aplicando miniworkspace "${String(preset.name)}"...`);
  startTimer();
  const deps =
    preset.dependencies !== undefined ? (preset.dependencies as Record<string, string>) : {};
  const devDeps =
    preset.devDependencies !== undefined ? (preset.devDependencies as Record<string, string>) : {};
  const all = { ...deps, ...devDeps };
  for (const [pkg, ver] of Object.entries(all)) {
    handlePkg(`${pkg}@${String(ver)}`);
  }
  showTimingStats();
  info(kleur.green(`🚀 Miniworkspace "${String(preset.name)}" aplicado!`));
}

// ---------------------
// Listar miniworkspaces
// ---------------------
function listPresets(): void {
  const files = readdirSync(presetDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    return info('Nenhum miniworkspace salvo ainda.');
  }
  info('📂 Miniworkspaces disponíveis:');
  files.forEach(f => console.log('  -', f.replace('.json', '')));
}

// ---------------------
// Instalar tudo do pkg
// ---------------------
function installAll(): void {
  ensureDir(workspace);
  if (!existsSync('package.json')) {
    error('Nenhum package.json encontrado neste diretório.');
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, unknown>;
  const pkgDeps =
    pkg.dependencies !== undefined ? (pkg.dependencies as Record<string, string>) : {};
  const pkgDevDeps =
    pkg.devDependencies !== undefined ? (pkg.devDependencies as Record<string, string>) : {};
  const all = { ...pkgDeps, ...pkgDevDeps };
  const deps = Object.entries(all).map(([k, v]) => `${k}@${String(v)}`);

  if (deps.length === 0) {
    return warn('Nenhuma dependência encontrada em package.json.');
  }

  info(`📁 Workspace: ${kleur.gray(workspace)}`);
  for (const dep of deps) {
    handlePkg(dep);
  }
  info(kleur.green('🚀 Instalação concluída!'));
}

// ---------------------
// Ajuda
// ---------------------
function showHelp(): void {
  console.log(kleur.bold('p3g CLI 1.4.0 - Compatível com Windows'));
  console.log(`
  ${kleur.cyan('Uso:')}
    ${kleur.green('p3g')} ${kleur.yellow('axios@latest')}       ${kleur.gray('→')} Instala pacote direto
    ${kleur.green('p3g')} ${kleur.blue('--dev')} ${kleur.yellow('vitest')}       ${kleur.gray('→')} Instala como devDependency
    ${kleur.green('p3g')} ${kleur.magenta('use')} ${kleur.yellow('api')}            ${kleur.gray('→')} Usa miniworkspace salvo
    ${kleur.green('p3g')} ${kleur.magenta('list')}               ${kleur.gray('→')} Lista miniworkspaces
    ${kleur.green('p3g')} ${kleur.blue('--copy')}             ${kleur.gray('→')} Força modo cópia (padrão no Windows)
    ${kleur.green('p3g')} ${kleur.blue('--symlink')}          ${kleur.gray('→')} Força symlinks no Windows (requer privilégios)
    ${kleur.green('p3g')} ${kleur.magenta('sync')}               ${kleur.gray('→')} Copia todos do workspace para node_modules
    ${kleur.green('p3g')} ${kleur.blue('--verbose')}          ${kleur.gray('→')} Logs detalhados
    ${kleur.green('p3g')} ${kleur.blue('--help')}             ${kleur.gray('→')} Mostra esta ajuda

  ${kleur.cyan('Notas do Windows:')}
    • Modo cópia é usado por padrão (mais compatível)
    • Use ${kleur.blue('--symlink')} para forçar symlinks (requer modo desenvolvedor ou admin)
    • Binários são criados como .cmd e .ps1 automaticamente
  `);
}

// ---------------------
// Execução principal
// ---------------------
void (async (): Promise<void> => {
  if (help) {
    return showHelp();
  }
  if (args[0] === 'list') {
    return listPresets();
  }
  if (args[0] === 'use' && args[1] !== undefined) {
    return usePreset(args[1]);
  }
  if (syncMode) {
    return syncWorkspace();
  }

  const pkgs = args.filter(a => !a.startsWith('--'));
  if (pkgs.length > 0) {
    startTimer();
    for (const dep of pkgs) {
      handlePkg(dep);
    }
    showTimingStats();
    await askSavePreset();
  } else {
    startTimer();
    installAll();
    showTimingStats();
  }
})();

// ---------------------
// Sincronizar workspace
// ---------------------
function syncWorkspace(): void {
  ensureDir(workspace);
  const all = listDirs(workspace);
  if (all.length === 0) {
    return warn('Nenhum pacote encontrado no workspace global.');
  }
  ensureDir('node_modules');
  for (const dir of all) {
    const src = join(workspace, dir);
    const name = dir.split('__')[0];
    const dest = join('node_modules', name);
    rmSync(dest, { recursive: true, force: true });
    
    if (isWindows) {
      // Windows: usa cpSync nativo do Node.js
      cpSync(src, dest, { recursive: true });
    } else {
      // Unix: usa comando cp para melhor performance
      exec(`cp -R "${src}" "${dest}"`);
    }
    log(`📁 Sincronizado ${name}`);
  }
  info(kleur.green('✨ Workspace sincronizado com sucesso!'));
}

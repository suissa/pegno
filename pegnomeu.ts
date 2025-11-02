#!/usr/bin/env bun
/**
 * pegnomeu.ts v1.3.0
 * CLI global de gerenciamento de dependências e mini-workspaces
 * Autor: Suissa 🧠
 */

import { execSync } from "child_process";
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
} from "fs";
import { join } from "path";
import * as os from "os";
import kleur from "kleur";
import readline from "readline";

// ---------------------
// Configurações globais
// ---------------------
const WORKSPACE = process.env.pegnomeu_WORKSPACE || join(os.homedir(), ".pegnomeu_workspace/js");
const TMPDIR = join(os.tmpdir(), `pegnomeu_install_${Date.now()}`);
const PRESET_DIR = join(WORKSPACE, "..", "presets");
ensureDir(PRESET_DIR);

const args = process.argv.slice(2);
const COPY_MODE = args.includes("--copy");
const VERBOSE = args.includes("--verbose");
const SYNC_MODE = args.includes("sync");
const HELP = args.includes("--help");
const IS_DEV = args.includes("--dev");

// ---------------------
// Funções de logging
// ---------------------
function log(...msg: any[]) {
  if (VERBOSE) console.log(kleur.cyan("[pegnomeu]"), ...msg);
}
function info(...msg: any[]) {
  console.log(kleur.blue("[pegnomeu]"), ...msg);
}
function warn(...msg: any[]) {
  console.warn(kleur.yellow("[AVISO]"), ...msg);
}
function error(...msg: any[]) {
  console.error(kleur.red("[ERRO]"), ...msg);
}

// ---------------------
// Utilitários
// ---------------------
function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}
function pkgDirname(pkg: string, ver: string) {
  const clean = pkg.replace(/[@/:]/g, "-");
  return `${clean}__${ver}`;
}
function exec(cmd: string, cwd?: string) {
  try {
    execSync(cmd, { cwd, stdio: "ignore" });
  } catch {
    error(`Falha ao executar: ${cmd}`);
    process.exit(1);
  }
}
function listDirs(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path).filter((f) => statSync(join(path, f)).isDirectory());
}

// ---------------------
// Atualiza package.json
// ---------------------
function addToPackageJSON(name: string, version: string, isDev = false) {
  const pkgPath = "package.json";
  let pkg: any = {};

  if (existsSync(pkgPath)) {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  } else {
    pkg = { name: "my-project", version: "1.0.0" };
  }

  const key = isDev ? "devDependencies" : "dependencies";
  if (!pkg[key]) pkg[key] = {};
  pkg[key][name] = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  info(`🧾 Adicionado ${kleur.cyan(name)}@${kleur.gray(version)} em ${kleur.yellow(key)}`);
}

function ensureBinDir() {
  const BIN = "node_modules/.bin";
  if (!existsSync(BIN)) mkdirSync(BIN, { recursive: true });
  return BIN;
}

function linkPackageBins(pkgName: string, pkgPathInNodeModules: string) {
  // Lê package.json do pacote linkado/copied
  const pkgJsonPath = join(pkgPathInNodeModules, "package.json");
  if (!existsSync(pkgJsonPath)) return;

  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const bin = pkg.bin;
  if (!bin) return;

  const BIN_DIR = ensureBinDir();

  const entries =
    typeof bin === "string"
      ? { [pkgName]: bin }
      : bin; // { binName: "dist/cli.js", ... }

  for (const [binName, relTarget] of Object.entries(entries)) {
    const src = join(pkgPathInNodeModules, relTarget as string);
    if (!existsSync(src)) {
      warn(`Bin não encontrado para ${pkgName}: ${relTarget}`);
      continue;
    }

    // nome do link no .bin → usa a key do bin ou o nome do pacote
    const linkName = join(BIN_DIR, binName);
    rmSync(linkName, { force: true });

    try {
      symlinkSync(src, linkName);
      info(`🔗 .bin: ${kleur.magenta(binName)} → ${kleur.gray(src)}`);
    } catch {
      // fallback Windows (cria cópia .cmd não implementado aqui; manter simples em Linux)
      warn(`Falha ao linkar .bin para ${pkgName}/${binName}`);
    }
  }
}

// ---------------------
// Instala pacote único
// ---------------------
function handlePkg(raw: string) {
  let name = raw;
  let version = "latest";

  if (raw.startsWith("@")) {
    // Suporta "@scope/pkg@ver"
    const at = raw.lastIndexOf("@");
    if (at > 0) {
      name = raw.slice(0, at);
      version = raw.slice(at + 1) || "latest";
    }
  } else if (raw.includes("@")) {
    const [n, v] = raw.split("@");
    name = n;
    version = v || "latest";
  }

  // Sanitize só para o nome da pasta no workspace (mantém versão original no package.json)
  const safeVer = version.replace(/[^0-9A-Za-z._-]/g, "_");
  const dir = pkgDirname(name, safeVer);
  const target = join(WORKSPACE, dir);
  ensureDir(WORKSPACE);

  if (!existsSync(target)) {
    info(`⬇️  Baixando ${name}@${version} com Bun...`);
    ensureDir(TMPDIR);
    exec(`bun add "${name}@${version}" --no-save`, TMPDIR);

    const pkgPath = join(TMPDIR, "node_modules", name);
    if (!existsSync(pkgPath)) {
      error(`Pacote ${name} não encontrado após bun add.`);
      process.exit(1);
    }
    cpSync(pkgPath, target, { recursive: true });
    info(`📦 Copiado para ${kleur.green(target)}`);
  } else {
    log(`✅ Encontrado no workspace: ${name}@${version}`);
  }

  ensureDir("node_modules");

  // Para escopos (@scope/pkg), garante o diretório pai do symlink/cópia
  const nodePath = join("node_modules", name);
  const nodeParent = join("node_modules", name.startsWith("@") ? name.split("/")[0] : "");
  if (name.startsWith("@")) ensureDir(nodeParent);

  // Remove o destino anterior
  rmSync(nodePath, { recursive: true, force: true });

  if (COPY_MODE) {
    // Somente copiar no modo --copy (sem symlink)
    cpSync(target, nodePath, { recursive: true });
    info(`📁 Copiado ${kleur.magenta(name)} → node_modules`);
  } else {
    // Symlink no modo padrão
    // Em alguns SOs, parent precisa existir (acima já garantimos)
    symlinkSync(target, nodePath, "dir");
    info(`🔗 Vinculado ${kleur.magenta(nodePath)} → ${kleur.gray(target)}`);
  }
  
  linkPackageBins(name, nodePath);
  addToPackageJSON(name, version, IS_DEV);
}


// ---------------------
// Salvar miniworkspace
// ---------------------
async function askSavePreset() {
  const pkgPath = "package.json";
  if (!existsSync(pkgPath)) return;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise<void>((resolve) => {
    rl.question("Deseja salvar estas dependências como miniworkspace? (y/n) ", (ans) => {
      if (ans.toLowerCase() !== "y") return rl.close(), resolve();
      rl.question("Nome do miniworkspace: ", (name) => {
        const path = join(PRESET_DIR, `${name}.json`);
        const data = {
          name,
          dependencies: pkg.dependencies || {},
          devDependencies: pkg.devDependencies || {},
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
function usePreset(name: string) {
  const path = join(PRESET_DIR, `${name}.json`);
  if (!existsSync(path)) return error(`Miniworkspace "${name}" não encontrado.`);
  const preset = JSON.parse(readFileSync(path, "utf8"));
  info(`🧠 Aplicando miniworkspace "${preset.name}"...`);
  const all = { ...preset.dependencies, ...preset.devDependencies };
  for (const [pkg, ver] of Object.entries(all)) handlePkg(`${pkg}@${ver}`);
  info(kleur.green(`🚀 Miniworkspace "${preset.name}" aplicado!`));
}

// ---------------------
// Listar miniworkspaces
// ---------------------
function listPresets() {
  const files = readdirSync(PRESET_DIR).filter((f) => f.endsWith(".json"));
  if (!files.length) return info("Nenhum miniworkspace salvo ainda.");
  info("📂 Miniworkspaces disponíveis:");
  files.forEach((f) => console.log("  -", f.replace(".json", "")));
}

// ---------------------
// Instalar tudo do pkg
// ---------------------
function installAll() {
  ensureDir(WORKSPACE);
  if (!existsSync("package.json")) {
    error("Nenhum package.json encontrado neste diretório.");
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  const deps = Object.entries(all).map(([k, v]) => `${k}@${v}`);

  if (!deps.length) return warn("Nenhuma dependência encontrada em package.json.");

  info(`📁 Workspace: ${kleur.gray(WORKSPACE)}`);
  for (const dep of deps) handlePkg(dep);
  info(kleur.green("🚀 Instalação concluída!"));
}

// ---------------------
// Ajuda
// ---------------------
function showHelp() {
  console.log(kleur.bold("pegnomeu CLI 1.3.0"));
  console.log(`
  ${kleur.cyan("Uso:")}
    ${kleur.green("pegnomeu")} ${kleur.yellow("axios@latest")}       ${kleur.gray("→")} Instala pacote direto
    ${kleur.green("pegnomeu")} ${kleur.blue("--dev")} ${kleur.yellow("vitest")}       ${kleur.gray("→")} Instala como devDependency
    ${kleur.green("pegnomeu")} ${kleur.magenta("use")} ${kleur.yellow("api")}            ${kleur.gray("→")} Usa miniworkspace salvo
    ${kleur.green("pegnomeu")} ${kleur.magenta("list")}               ${kleur.gray("→")} Lista miniworkspaces
    ${kleur.green("pegnomeu")} ${kleur.blue("--copy")}             ${kleur.gray("→")} Copia ao invés de linkar
    ${kleur.green("pegnomeu")} ${kleur.magenta("sync")}               ${kleur.gray("→")} Copia todos do workspace para node_modules
    ${kleur.green("pegnomeu")} ${kleur.blue("--verbose")}          ${kleur.gray("→")} Logs detalhados
    ${kleur.green("pegnomeu")} ${kleur.blue("--help")}             ${kleur.gray("→")} Mostra esta ajuda
  `);
}

// ---------------------
// Execução principal
// ---------------------
(async () => {
  if (HELP) return showHelp();
  if (args[0] === "list") return listPresets();
  if (args[0] === "use" && args[1]) return usePreset(args[1]);
  if (SYNC_MODE) return syncWorkspace();

  const pkgs = args.filter((a) => !a.startsWith("--"));
  if (pkgs.length) {
    for (const dep of pkgs) handlePkg(dep);
    await askSavePreset();
  } else {
    installAll();
  }
})();

// ---------------------
// Sincronizar workspace
// ---------------------
function syncWorkspace() {
  ensureDir(WORKSPACE);
  const all = listDirs(WORKSPACE);
  if (!all.length) return warn("Nenhum pacote encontrado no workspace global.");
  ensureDir("node_modules");
  for (const dir of all) {
    const src = join(WORKSPACE, dir);
    const name = dir.split("__")[0];
    const dest = join("node_modules", name);
    rmSync(dest, { recursive: true, force: true });
    exec(`cp -R "${src}" "${dest}"`);
    log(`📁 Sincronizado ${name}`);
  }
  info(kleur.green("✨ Workspace sincronizado com sucesso!"));
}

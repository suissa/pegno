#!/usr/bin/env bun
// @bun

// p3g.ts
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
  writeFileSync
} from "fs";
import { join, relative } from "path";
import * as os from "os";

// packages/kleur/index.ts
var COLORS = {
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  reset: [0, 0]
};
function createColorFunction(openCode, closeCode) {
  return (text) => {
    const noColor = globalThis.process?.env?.NO_COLOR;
    const forceColor = globalThis.process?.env?.FORCE_COLOR;
    if (noColor && !forceColor) {
      return text;
    }
    return `\x1B[${openCode}m${text}\x1B[${closeCode}m`;
  };
}
var kleur = {
  black: createColorFunction(...COLORS.black),
  red: createColorFunction(...COLORS.red),
  green: createColorFunction(...COLORS.green),
  yellow: createColorFunction(...COLORS.yellow),
  blue: createColorFunction(...COLORS.blue),
  magenta: createColorFunction(...COLORS.magenta),
  cyan: createColorFunction(...COLORS.cyan),
  white: createColorFunction(...COLORS.white),
  gray: createColorFunction(...COLORS.gray),
  redBright: createColorFunction(...COLORS.redBright),
  greenBright: createColorFunction(...COLORS.greenBright),
  yellowBright: createColorFunction(...COLORS.yellowBright),
  blueBright: createColorFunction(...COLORS.blueBright),
  magentaBright: createColorFunction(...COLORS.magentaBright),
  cyanBright: createColorFunction(...COLORS.cyanBright),
  whiteBright: createColorFunction(...COLORS.whiteBright),
  bgBlack: createColorFunction(...COLORS.bgBlack),
  bgRed: createColorFunction(...COLORS.bgRed),
  bgGreen: createColorFunction(...COLORS.bgGreen),
  bgYellow: createColorFunction(...COLORS.bgYellow),
  bgBlue: createColorFunction(...COLORS.bgBlue),
  bgMagenta: createColorFunction(...COLORS.bgMagenta),
  bgCyan: createColorFunction(...COLORS.bgCyan),
  bgWhite: createColorFunction(...COLORS.bgWhite),
  bgBlackBright: createColorFunction(...COLORS.bgBlackBright),
  bgRedBright: createColorFunction(...COLORS.bgRedBright),
  bgGreenBright: createColorFunction(...COLORS.bgGreenBright),
  bgYellowBright: createColorFunction(...COLORS.bgYellowBright),
  bgBlueBright: createColorFunction(...COLORS.bgBlueBright),
  bgMagentaBright: createColorFunction(...COLORS.bgMagentaBright),
  bgCyanBright: createColorFunction(...COLORS.bgCyanBright),
  bgWhiteBright: createColorFunction(...COLORS.bgWhiteBright),
  bold: createColorFunction(...COLORS.bold),
  dim: createColorFunction(...COLORS.dim),
  italic: createColorFunction(...COLORS.italic),
  underline: createColorFunction(...COLORS.underline),
  inverse: createColorFunction(...COLORS.inverse),
  hidden: createColorFunction(...COLORS.hidden),
  strikethrough: createColorFunction(...COLORS.strikethrough),
  reset: createColorFunction(...COLORS.reset)
};
Object.keys(COLORS).forEach((key) => {
  const func = kleur[key];
  if (func) {
    Object.keys(COLORS).forEach((chainKey) => {
      const chainFunc = kleur[chainKey];
      if (chainFunc) {
        func[chainKey] = function(text) {
          if (text !== undefined) {
            return func(chainFunc(text));
          }
          return function(innerText) {
            return func(chainFunc(innerText));
          };
        };
      }
    });
  }
});
var kleur_default = kleur;

// packages/readline/index.ts
class Interface {
  input;
  output;
  promptText;
  buffer = "";
  isReading = false;
  constructor(options) {
    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;
    this.promptText = options.prompt || "> ";
    if (this.input.isTTY) {
      this.input.setRawMode(true);
    }
    this.input.setEncoding("utf8");
    this.setupListeners();
  }
  setupListeners() {
    this.input.on("data", (chunk) => {
      this.handleInput(chunk);
    });
    this.input.on("close", () => {
      this.close();
    });
  }
  handleInput(chunk) {
    for (const char of chunk) {
      switch (char) {
        case "\r":
        case `
`:
          this.submitLine();
          break;
        case "\x03":
          this.emit("SIGINT");
          this.close();
          process.exit(0);
          break;
        case "\x7F":
          this.backspace();
          break;
        case "\x1B":
          break;
        default:
          if (char >= " " && char <= "~") {
            this.buffer += char;
            this.output.write(char);
          }
          break;
      }
    }
  }
  submitLine() {
    this.output.write(`
`);
    const line = this.buffer;
    this.buffer = "";
    this.emit("line", line);
  }
  backspace() {
    if (this.buffer.length > 0) {
      this.buffer = this.buffer.slice(0, -1);
      this.output.write("\b \b");
    }
  }
  setPrompt(prompt) {
    this.promptText = prompt;
  }
  prompt(preserveCursor) {
    this.output.write(this.promptText);
    this.isReading = true;
  }
  question(query, callback) {
    this.once("line", callback);
    this.output.write(query);
    this.isReading = true;
  }
  questionAsync(query, options) {
    return new Promise((resolve) => {
      if (options?.hideEchoBack) {
        this.questionHidden(query, resolve, options.mask);
      } else {
        this.question(query, resolve);
      }
    });
  }
  questionHidden(query, callback, mask = "*") {
    const originalWrite = this.output.write;
    this.output.write = (chunk) => {
      if (typeof chunk === "string" && chunk.length === 1 && chunk >= " " && chunk <= "~") {
        return originalWrite.call(this.output, mask);
      }
      return originalWrite.call(this.output, chunk);
    };
    this.once("line", (answer) => {
      this.output.write = originalWrite;
      this.output.write(`
`);
      callback(answer);
    });
    this.output.write(query);
    this.isReading = true;
  }
  pause() {
    this.input.pause();
    return this;
  }
  resume() {
    this.input.resume();
    return this;
  }
  close() {
    if (this.input.isTTY) {
      this.input.setRawMode(false);
    }
    this.removeAllListeners();
    this.input.destroy();
  }
  write(data, key) {
    this.output.write(data);
  }
  listeners = new Map;
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
    return this;
  }
  once(event, listener) {
    const wrapped = (...args) => {
      listener(...args);
      this.removeListener(event, wrapped);
    };
    return this.on(event, wrapped);
  }
  removeListener(event, listener) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }
  removeAllListeners() {
    this.listeners.clear();
    return this;
  }
  emit(event, ...args) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
      return true;
    }
    return false;
  }
}
function question(query, options) {
  const rl = new Interface({
    input: options?.input || globalThis.process?.stdin,
    output: options?.output || globalThis.process?.stdout,
    prompt: options?.prompt
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// p3g.ts
var workspace = process.env.pegno_WORKSPACE !== undefined && process.env.pegno_WORKSPACE.trim() !== "" ? process.env.pegno_WORKSPACE : join(os.homedir(), ".pegno_workspace/js");
var tmpdir2 = join(os.tmpdir(), `pegno_install_${Date.now()}`);
var presetDir = join(workspace, "..", "presets");
ensureDir(presetDir);
var args = process.argv.slice(2);
var copyMode = args.includes("--copy");
var verbose = args.includes("--verbose");
var syncMode = args.includes("sync");
var help = args.includes("--help");
var isDev = args.includes("--dev");
var installStartTime = 0;
var uniquePackagesInstalled = 0;
function log(...msg) {
  if (verbose) {
    console.log(kleur_default.cyan("[pegno]"), ...msg);
  }
}
function info(...msg) {
  console.log(kleur_default.blue("[pegno]"), ...msg);
}
function warn(...msg) {
  console.warn(kleur_default.yellow("[AVISO]"), ...msg);
}
function error(...msg) {
  console.error(kleur_default.red("[ERRO]"), ...msg);
}
function startTimer() {
  installStartTime = Date.now();
}
function formatTime(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${(ms / 60000).toFixed(1)}min`;
}
function showTimingStats() {
  if (installStartTime === 0 || uniquePackagesInstalled === 0) {
    return;
  }
  const totalTime = Date.now() - installStartTime;
  const avgTime = totalTime / uniquePackagesInstalled;
  info(`\u23F1\uFE0F  Tempo total: ${kleur_default.green(formatTime(totalTime))}`);
  info(`\uD83D\uDCCA M\xE9dia por depend\xEAncia: ${kleur_default.cyan(formatTime(avgTime))} (${kleur_default.gray(String(uniquePackagesInstalled) + " pacotes \xFAnicos")})`);
}
function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}
function pkgDirname(pkg, ver) {
  const clean = pkg.replace(/[@/:]/g, "-");
  return `${clean}__${ver}`;
}
function exec(cmd, cwd) {
  try {
    execSync(cmd, { cwd, stdio: "ignore" });
  } catch {
    error(`Falha ao executar: ${cmd}`);
    process.exit(1);
  }
}
function listDirs(path) {
  if (!existsSync(path)) {
    return [];
  }
  return readdirSync(path).filter((f) => statSync(join(path, f)).isDirectory());
}
function addToPackageJSON(name, version, isDevDep = false) {
  const pkgPath = "package.json";
  let pkg = {};
  if (existsSync(pkgPath)) {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  } else {
    pkg = { name: "my-project", version: "1.0.0" };
  }
  const key = isDevDep ? "devDependencies" : "dependencies";
  pkg[key] ??= {};
  const deps = pkg[key];
  deps[name] = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  info(`\uD83E\uDDFE Adicionado ${kleur_default.cyan(name)}@${kleur_default.gray(version)} em ${kleur_default.yellow(key)}`);
}
function ensureBinDir() {
  const bin = "node_modules/.bin";
  if (!existsSync(bin)) {
    mkdirSync(bin, { recursive: true });
  }
  return bin;
}
function linkPackageBins(pkgName, pkgPathInNodeModules) {
  const pkgJsonPath = join(pkgPathInNodeModules, "package.json");
  if (!existsSync(pkgJsonPath)) {
    return;
  }
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const bin = pkg.bin;
  if (bin === undefined) {
    if (verbose) {
      warn(`Sem "bin" em ${pkgName}/package.json`);
    }
    return;
  }
  const binDir = ensureBinDir();
  const entries = typeof bin === "string" ? { [pkgName]: bin } : bin;
  for (const [binName, relTarget] of Object.entries(entries)) {
    const src = join(pkgPathInNodeModules, String(relTarget));
    if (!existsSync(src)) {
      warn(`Bin n\xE3o encontrado para ${pkgName}: ${String(relTarget)}`);
      continue;
    }
    const linkName = join(binDir, binName);
    if (os.platform() === "win32") {
      const cmdLink = `${linkName}.cmd`;
      const ps1Link = `${linkName}.ps1`;
      rmSync(linkName, { force: true });
      rmSync(cmdLink, { force: true });
      rmSync(ps1Link, { force: true });
      const relPath = relative(binDir, src);
      const runWithBun = `bun "%~dp0\\${relPath}" %*`;
      writeFileSync(cmdLink, `@echo off\r
${runWithBun}\r
`);
      const shContent = `#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

bun "$basedir/${relPath.replace(/\\/g, "/")}" "$@"
`;
      writeFileSync(linkName, shContent);
      info(`\uD83D\uDD17 .bin (shim): ${kleur_default.magenta(binName)}`);
    } else {
      rmSync(linkName, { force: true });
      try {
        symlinkSync(src, linkName);
        info(`\uD83D\uDD17 .bin: ${kleur_default.magenta(binName)} \u2192 ${kleur_default.gray(src)}`);
      } catch {
        warn(`Falha ao linkar .bin para ${pkgName}/${binName}`);
      }
    }
  }
}
function handlePkg(raw) {
  let name = raw;
  let version = "latest";
  if (raw.startsWith("@")) {
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
  const safeVer = version.replace(/[^0-9A-Za-z._-]/g, "_");
  const dir = pkgDirname(name, safeVer);
  const target = join(workspace, dir);
  ensureDir(workspace);
  if (!existsSync(target)) {
    info(`\u2B07\uFE0F  Baixando ${name}@${version} com Bun...`);
    const downloadStart = Date.now();
    ensureDir(tmpdir2);
    exec(`bun add "${name}@${version}" --no-save`, tmpdir2);
    const pkgPath = join(tmpdir2, "node_modules", name);
    if (!existsSync(pkgPath)) {
      error(`Pacote ${name} n\xE3o encontrado ap\xF3s bun add.`);
      process.exit(1);
    }
    cpSync(pkgPath, target, { recursive: true });
    try {
      cpSync(join(tmpdir2, "bun.lock"), target);
    } catch {}
    const downloadTime = Date.now() - downloadStart;
    info(`\uD83D\uDCE6 Copiado para ${kleur_default.green(target)} ${kleur_default.gray(`(${formatTime(downloadTime)})`)}`);
    uniquePackagesInstalled++;
  } else {
    log(`\u2705 Encontrado no workspace: ${name}@${version}`);
  }
  ensureDir("node_modules");
  const nodePath = join("node_modules", name);
  const nodeParent = join("node_modules", name.startsWith("@") ? name.split("/")[0] : "");
  if (name.startsWith("@")) {
    ensureDir(nodeParent);
  }
  rmSync(nodePath, { recursive: true, force: true });
  if (copyMode) {
    cpSync(target, nodePath, { recursive: true });
    info(`\uD83D\uDCC1 Copiado ${kleur_default.magenta(name)} \u2192 node_modules`);
  } else {
    const type = os.platform() === "win32" ? "junction" : "dir";
    symlinkSync(target, nodePath, type);
    info(`\uD83D\uDD17 Vinculado ${kleur_default.magenta(nodePath)} \u2192 ${kleur_default.gray(target)}`);
  }
  linkPackageBins(name, nodePath);
  hydrateDepsOf(name);
  addToPackageJSON(name, version, isDev);
}
function readPkgJson(dir) {
  const p = join(dir, "package.json");
  if (!existsSync(p)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}
function hydrateDepsOf(name) {
  const pkgDir = join("node_modules", name);
  const pkg = readPkgJson(pkgDir);
  if (pkg === null) {
    warn(`N\xE3o achei package.json de ${name} para hidratar.`);
    return;
  }
  const pkgDeps = pkg.dependencies !== undefined ? pkg.dependencies : {};
  const direct = { ...pkgDeps };
  const entries = Object.entries(direct);
  if (entries.length === 0) {
    log(`Sem deps diretas para ${name}.`);
    return;
  }
  info(`\uD83D\uDCA7 Hidratando deps diretas de ${name}: ${entries.length} pacote(s)`);
  for (const [depName, depVer] of entries) {
    handlePkg(`${depName}@${String(depVer)}`);
  }
}
async function askSavePreset() {
  const pkgPath = "package.json";
  if (!existsSync(pkgPath)) {
    return;
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  try {
    const ans = await question("Deseja salvar estas depend\xEAncias como miniworkspace? (y/n) ");
    if (ans.toLowerCase() !== "y") {
      return;
    }
    const name = await question("Nome do miniworkspace: ");
    const path = join(presetDir, `${name}.json`);
    const deps = pkg.dependencies !== undefined ? pkg.dependencies : {};
    const devDeps = pkg.devDependencies !== undefined ? pkg.devDependencies : {};
    const data = {
      name,
      dependencies: deps,
      devDependencies: devDeps
    };
    writeFileSync(path, JSON.stringify(data, null, 2));
    info(`\u2705 Miniworkspace "${name}" salvo em ${kleur_default.gray(path)}`);
  } catch (error2) {
    return;
  }
}
function usePreset(name) {
  const path = join(presetDir, `${name}.json`);
  if (!existsSync(path)) {
    return error(`Miniworkspace "${name}" n\xE3o encontrado.`);
  }
  const preset = JSON.parse(readFileSync(path, "utf8"));
  info(`\uD83E\uDDE0 Aplicando miniworkspace "${String(preset.name)}"...`);
  startTimer();
  const deps = preset.dependencies !== undefined ? preset.dependencies : {};
  const devDeps = preset.devDependencies !== undefined ? preset.devDependencies : {};
  const all = { ...deps, ...devDeps };
  for (const [pkg, ver] of Object.entries(all)) {
    handlePkg(`${pkg}@${String(ver)}`);
  }
  showTimingStats();
  info(kleur_default.green(`\uD83D\uDE80 Miniworkspace "${String(preset.name)}" aplicado!`));
}
function listPresets() {
  const files = readdirSync(presetDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    return info("Nenhum miniworkspace salvo ainda.");
  }
  info("\uD83D\uDCC2 Miniworkspaces dispon\xEDveis:");
  files.forEach((f) => console.log("  -", f.replace(".json", "")));
}
function installAll() {
  ensureDir(workspace);
  if (!existsSync("package.json")) {
    error("Nenhum package.json encontrado neste diret\xF3rio.");
    process.exit(1);
  }
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const pkgDeps = pkg.dependencies !== undefined ? pkg.dependencies : {};
  const pkgDevDeps = pkg.devDependencies !== undefined ? pkg.devDependencies : {};
  const all = { ...pkgDeps, ...pkgDevDeps };
  const deps = Object.entries(all).map(([k, v]) => `${k}@${String(v)}`);
  if (deps.length === 0) {
    return warn("Nenhuma depend\xEAncia encontrada em package.json.");
  }
  info(`\uD83D\uDCC1 Workspace: ${kleur_default.gray(workspace)}`);
  for (const dep of deps) {
    handlePkg(dep);
  }
  info(kleur_default.green("\uD83D\uDE80 Instala\xE7\xE3o conclu\xEDda!"));
}
function showHelp() {
  console.log(kleur_default.bold("pegno CLI 1.3.0"));
  console.log(`
  ${kleur_default.cyan("Uso:")}
    ${kleur_default.green("pegno")} ${kleur_default.yellow("axios@latest")}       ${kleur_default.gray("\u2192")} Instala pacote direto
    ${kleur_default.green("pegno")} ${kleur_default.blue("--dev")} ${kleur_default.yellow("vitest")}       ${kleur_default.gray("\u2192")} Instala como devDependency
    ${kleur_default.green("pegno")} ${kleur_default.magenta("use")} ${kleur_default.yellow("api")}            ${kleur_default.gray("\u2192")} Usa miniworkspace salvo
    ${kleur_default.green("pegno")} ${kleur_default.magenta("list")}               ${kleur_default.gray("\u2192")} Lista miniworkspaces
    ${kleur_default.green("pegno")} ${kleur_default.blue("--copy")}             ${kleur_default.gray("\u2192")} Copia ao inv\xE9s de linkar
    ${kleur_default.green("pegno")} ${kleur_default.magenta("sync")}               ${kleur_default.gray("\u2192")} Copia todos do workspace para node_modules
    ${kleur_default.green("pegno")} ${kleur_default.blue("--verbose")}          ${kleur_default.gray("\u2192")} Logs detalhados
    ${kleur_default.green("pegno")} ${kleur_default.blue("--help")}             ${kleur_default.gray("\u2192")} Mostra esta ajuda
  `);
}
(async () => {
  if (help) {
    return showHelp();
  }
  if (args[0] === "list") {
    return listPresets();
  }
  if (args[0] === "use" && args[1] !== undefined) {
    return usePreset(args[1]);
  }
  if (syncMode) {
    return syncWorkspace();
  }
  const pkgs = args.filter((a) => !a.startsWith("--"));
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
function syncWorkspace() {
  ensureDir(workspace);
  const all = listDirs(workspace);
  if (all.length === 0) {
    return warn("Nenhum pacote encontrado no workspace global.");
  }
  ensureDir("node_modules");
  for (const dir of all) {
    const src = join(workspace, dir);
    const name = dir.split("__")[0];
    const dest = join("node_modules", name);
    rmSync(dest, { recursive: true, force: true });
    exec(`cp "${src}/bun.lock" "${dest}"`);
    exec(`cp -R "${src}" "${dest}"`);
    log(`\uD83D\uDCC1 Sincronizado ${name}`);
  }
  info(kleur_default.green("\u2728 Workspace sincronizado com sucesso!"));
}

#!/usr/bin/env bun
// @bun

// pegno.ts
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
import { join } from "path";
import * as os from "os";

// node_modules/kleur/index.mjs
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
  ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
  isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
  enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY),
  reset: init(0, 0),
  bold: init(1, 22),
  dim: init(2, 22),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  grey: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49)
};
function run(arr, str) {
  let i = 0, tmp, beg = "", end = "";
  for (;i < arr.length; i++) {
    tmp = arr[i];
    beg += tmp.open;
    end += tmp.close;
    if (!!~str.indexOf(tmp.close)) {
      str = str.replace(tmp.rgx, tmp.close + tmp.open);
    }
  }
  return beg + str + end;
}
function chain(has, keys) {
  let ctx = { has, keys };
  ctx.reset = $.reset.bind(ctx);
  ctx.bold = $.bold.bind(ctx);
  ctx.dim = $.dim.bind(ctx);
  ctx.italic = $.italic.bind(ctx);
  ctx.underline = $.underline.bind(ctx);
  ctx.inverse = $.inverse.bind(ctx);
  ctx.hidden = $.hidden.bind(ctx);
  ctx.strikethrough = $.strikethrough.bind(ctx);
  ctx.black = $.black.bind(ctx);
  ctx.red = $.red.bind(ctx);
  ctx.green = $.green.bind(ctx);
  ctx.yellow = $.yellow.bind(ctx);
  ctx.blue = $.blue.bind(ctx);
  ctx.magenta = $.magenta.bind(ctx);
  ctx.cyan = $.cyan.bind(ctx);
  ctx.white = $.white.bind(ctx);
  ctx.gray = $.gray.bind(ctx);
  ctx.grey = $.grey.bind(ctx);
  ctx.bgBlack = $.bgBlack.bind(ctx);
  ctx.bgRed = $.bgRed.bind(ctx);
  ctx.bgGreen = $.bgGreen.bind(ctx);
  ctx.bgYellow = $.bgYellow.bind(ctx);
  ctx.bgBlue = $.bgBlue.bind(ctx);
  ctx.bgMagenta = $.bgMagenta.bind(ctx);
  ctx.bgCyan = $.bgCyan.bind(ctx);
  ctx.bgWhite = $.bgWhite.bind(ctx);
  return ctx;
}
function init(open, close) {
  let blk = {
    open: `\x1B[${open}m`,
    close: `\x1B[${close}m`,
    rgx: new RegExp(`\\x1b\\[${close}m`, "g")
  };
  return function(txt) {
    if (this !== undefined && this.has !== undefined) {
      !!~this.has.indexOf(open) || (this.has.push(open), this.keys.push(blk));
      return txt === undefined ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
    }
    return txt === undefined ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
  };
}
var kleur_default = $;

// pegno.ts
import readline from "readline";
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
    rmSync(linkName, { force: true });
    try {
      symlinkSync(src, linkName);
      info(`\uD83D\uDD17 .bin: ${kleur_default.magenta(binName)} \u2192 ${kleur_default.gray(src)}`);
    } catch {
      warn(`Falha ao linkar .bin para ${pkgName}/${binName}`);
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
    cpSync("./bun.lock", target);
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
    symlinkSync(target, nodePath, "dir");
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
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("Deseja salvar estas depend\xEAncias como miniworkspace? (y/n) ", (ans) => {
      if (ans.toLowerCase() !== "y") {
        return rl.close(), resolve();
      }
      rl.question("Nome do miniworkspace: ", (name) => {
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
        rl.close();
        resolve();
      });
    });
  });
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

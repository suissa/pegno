#!/usr/bin/env bun
// @bun

// pegnomeu.ts
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

// ../../../../../../../../home/suissa/.pegnomeu_workspace/js/kleur___4.1.5/index.mjs
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
var kleur___4_1_default = $;

// pegnomeu.ts
import readline from "readline";
var WORKSPACE = process.env.pegnomeu_WORKSPACE || join(os.homedir(), ".pegnomeu_workspace/js");
var TMPDIR = join(os.tmpdir(), `pegnomeu_install_${Date.now()}`);
var PRESET_DIR = join(WORKSPACE, "..", "presets");
ensureDir(PRESET_DIR);
var args = process.argv.slice(2);
var COPY_MODE = args.includes("--copy");
var VERBOSE = args.includes("--verbose");
var SYNC_MODE = args.includes("sync");
var HELP = args.includes("--help");
var IS_DEV = args.includes("--dev");
function log(...msg) {
  if (VERBOSE)
    console.log(kleur___4_1_default.cyan("[pegnomeu]"), ...msg);
}
function info(...msg) {
  console.log(kleur___4_1_default.blue("[pegnomeu]"), ...msg);
}
function warn(...msg) {
  console.warn(kleur___4_1_default.yellow("[AVISO]"), ...msg);
}
function error(...msg) {
  console.error(kleur___4_1_default.red("[ERRO]"), ...msg);
}
function ensureDir(path) {
  if (!existsSync(path))
    mkdirSync(path, { recursive: true });
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
  if (!existsSync(path))
    return [];
  return readdirSync(path).filter((f) => statSync(join(path, f)).isDirectory());
}
function addToPackageJSON(name, version, isDev = false) {
  const pkgPath = "package.json";
  let pkg = {};
  if (existsSync(pkgPath)) {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  } else {
    pkg = { name: "my-project", version: "1.0.0" };
  }
  const key = isDev ? "devDependencies" : "dependencies";
  if (!pkg[key])
    pkg[key] = {};
  pkg[key][name] = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  info(`\uD83E\uDDFE Adicionado ${kleur___4_1_default.cyan(name)}@${kleur___4_1_default.gray(version)} em ${kleur___4_1_default.yellow(key)}`);
}
function ensureBinDir() {
  const BIN = "node_modules/.bin";
  if (!existsSync(BIN))
    mkdirSync(BIN, { recursive: true });
  return BIN;
}
function linkPackageBins(pkgName, pkgPathInNodeModules) {
  const pkgJsonPath = join(pkgPathInNodeModules, "package.json");
  if (!existsSync(pkgJsonPath))
    return;
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const bin = pkg.bin;
  if (!bin)
    return;
  const BIN_DIR = ensureBinDir();
  const entries = typeof bin === "string" ? { [pkgName]: bin } : bin;
  for (const [binName, relTarget] of Object.entries(entries)) {
    const src = join(pkgPathInNodeModules, relTarget);
    if (!existsSync(src)) {
      warn(`Bin n\xE3o encontrado para ${pkgName}: ${relTarget}`);
      continue;
    }
    const linkName = join(BIN_DIR, binName);
    rmSync(linkName, { force: true });
    try {
      symlinkSync(src, linkName);
      info(`\uD83D\uDD17 .bin: ${kleur___4_1_default.magenta(binName)} \u2192 ${kleur___4_1_default.gray(src)}`);
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
  const target = join(WORKSPACE, dir);
  ensureDir(WORKSPACE);
  if (!existsSync(target)) {
    info(`\u2B07\uFE0F  Baixando ${name}@${version} com Bun...`);
    ensureDir(TMPDIR);
    exec(`bun add "${name}@${version}" --no-save`, TMPDIR);
    const pkgPath = join(TMPDIR, "node_modules", name);
    if (!existsSync(pkgPath)) {
      error(`Pacote ${name} n\xE3o encontrado ap\xF3s bun add.`);
      process.exit(1);
    }
    cpSync(pkgPath, target, { recursive: true });
    info(`\uD83D\uDCE6 Copiado para ${kleur___4_1_default.green(target)}`);
  } else {
    log(`\u2705 Encontrado no workspace: ${name}@${version}`);
  }
  ensureDir("node_modules");
  const nodePath = join("node_modules", name);
  const nodeParent = join("node_modules", name.startsWith("@") ? name.split("/")[0] : "");
  if (name.startsWith("@"))
    ensureDir(nodeParent);
  rmSync(nodePath, { recursive: true, force: true });
  if (COPY_MODE) {
    cpSync(target, nodePath, { recursive: true });
    info(`\uD83D\uDCC1 Copiado ${kleur___4_1_default.magenta(name)} \u2192 node_modules`);
  } else {
    symlinkSync(target, nodePath, "dir");
    info(`\uD83D\uDD17 Vinculado ${kleur___4_1_default.magenta(nodePath)} \u2192 ${kleur___4_1_default.gray(target)}`);
  }
  linkPackageBins(name, nodePath);
  addToPackageJSON(name, version, IS_DEV);
}
async function askSavePreset() {
  const pkgPath = "package.json";
  if (!existsSync(pkgPath))
    return;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("Deseja salvar estas depend\xEAncias como miniworkspace? (y/n) ", (ans) => {
      if (ans.toLowerCase() !== "y")
        return rl.close(), resolve();
      rl.question("Nome do miniworkspace: ", (name) => {
        const path = join(PRESET_DIR, `${name}.json`);
        const data = {
          name,
          dependencies: pkg.dependencies || {},
          devDependencies: pkg.devDependencies || {}
        };
        writeFileSync(path, JSON.stringify(data, null, 2));
        info(`\u2705 Miniworkspace "${name}" salvo em ${kleur___4_1_default.gray(path)}`);
        rl.close();
        resolve();
      });
    });
  });
}
function usePreset(name) {
  const path = join(PRESET_DIR, `${name}.json`);
  if (!existsSync(path))
    return error(`Miniworkspace "${name}" n\xE3o encontrado.`);
  const preset = JSON.parse(readFileSync(path, "utf8"));
  info(`\uD83E\uDDE0 Aplicando miniworkspace "${preset.name}"...`);
  const all = { ...preset.dependencies, ...preset.devDependencies };
  for (const [pkg, ver] of Object.entries(all))
    handlePkg(`${pkg}@${ver}`);
  info(kleur___4_1_default.green(`\uD83D\uDE80 Miniworkspace "${preset.name}" aplicado!`));
}
function listPresets() {
  const files = readdirSync(PRESET_DIR).filter((f) => f.endsWith(".json"));
  if (!files.length)
    return info("Nenhum miniworkspace salvo ainda.");
  info("\uD83D\uDCC2 Miniworkspaces dispon\xEDveis:");
  files.forEach((f) => console.log("  -", f.replace(".json", "")));
}
function installAll() {
  ensureDir(WORKSPACE);
  if (!existsSync("package.json")) {
    error("Nenhum package.json encontrado neste diret\xF3rio.");
    process.exit(1);
  }
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  const deps = Object.entries(all).map(([k, v]) => `${k}@${v}`);
  if (!deps.length)
    return warn("Nenhuma depend\xEAncia encontrada em package.json.");
  info(`\uD83D\uDCC1 Workspace: ${kleur___4_1_default.gray(WORKSPACE)}`);
  for (const dep of deps)
    handlePkg(dep);
  info(kleur___4_1_default.green("\uD83D\uDE80 Instala\xE7\xE3o conclu\xEDda!"));
}
function showHelp() {
  console.log(kleur___4_1_default.bold("pegnomeu CLI 1.3.0"));
  console.log(`
  ${kleur___4_1_default.cyan("Uso:")}
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.yellow("axios@latest")}       ${kleur___4_1_default.gray("\u2192")} Instala pacote direto
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.blue("--dev")} ${kleur___4_1_default.yellow("vitest")}       ${kleur___4_1_default.gray("\u2192")} Instala como devDependency
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.magenta("use")} ${kleur___4_1_default.yellow("api")}            ${kleur___4_1_default.gray("\u2192")} Usa miniworkspace salvo
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.magenta("list")}               ${kleur___4_1_default.gray("\u2192")} Lista miniworkspaces
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.blue("--copy")}             ${kleur___4_1_default.gray("\u2192")} Copia ao inv\xE9s de linkar
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.magenta("sync")}               ${kleur___4_1_default.gray("\u2192")} Copia todos do workspace para node_modules
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.blue("--verbose")}          ${kleur___4_1_default.gray("\u2192")} Logs detalhados
    ${kleur___4_1_default.green("pegnomeu")} ${kleur___4_1_default.blue("--help")}             ${kleur___4_1_default.gray("\u2192")} Mostra esta ajuda
  `);
}
(async () => {
  if (HELP)
    return showHelp();
  if (args[0] === "list")
    return listPresets();
  if (args[0] === "use" && args[1])
    return usePreset(args[1]);
  if (SYNC_MODE)
    return syncWorkspace();
  const pkgs = args.filter((a) => !a.startsWith("--"));
  if (pkgs.length) {
    for (const dep of pkgs)
      handlePkg(dep);
    await askSavePreset();
  } else {
    installAll();
  }
})();
function syncWorkspace() {
  ensureDir(WORKSPACE);
  const all = listDirs(WORKSPACE);
  if (!all.length)
    return warn("Nenhum pacote encontrado no workspace global.");
  ensureDir("node_modules");
  for (const dir of all) {
    const src = join(WORKSPACE, dir);
    const name = dir.split("__")[0];
    const dest = join("node_modules", name);
    rmSync(dest, { recursive: true, force: true });
    exec(`cp -R "${src}" "${dest}"`);
    log(`\uD83D\uDCC1 Sincronizado ${name}`);
  }
  info(kleur___4_1_default.green("\u2728 Workspace sincronizado com sucesso!"));
}

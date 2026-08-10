import { customAlphabet } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import * as path from "https://deno.land/std@0.215.0/path/mod.ts";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(
  alphabet + alphabet.toUpperCase() + "0123456789-",
  12,
);

interface Result {
  [name: string]: Result | string;
}

function getChangedFiles(): Set<string> {
  const cmd = new Deno.Command("git", {
    args: ["status", "--porcelain"],
    stdout: "piped",
  });
  const output = cmd.outputSync();
  const text = new TextDecoder().decode(output.stdout);
  const changed = new Set<string>();
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    // Format: "XY filepath" or "XY old -> new" for renames
    const filePath = line.slice(3).trim();
    const arrowIndex = filePath.indexOf(" -> ");
    changed.add(arrowIndex >= 0 ? filePath.slice(arrowIndex + 4) : filePath);
  }
  return changed;
}

function loadExistingIndex(dir: string): Result {
  try {
    return JSON.parse(Deno.readTextFileSync(`${dir}/index.json`));
  } catch {
    return {};
  }
}

function walkDir(
  dir: string,
  changedFiles: Set<string>,
  existing: Result,
  result: Result = {},
) {
  const list = Deno.readDirSync(dir);
  for (const item of list) {
    const itemPath = path.join(dir, item.name);
    const stats = Deno.statSync(itemPath);
    if (stats.isDirectory) {
      const obj: Result = {};
      result[item.name] = obj;
      walkDir(itemPath, changedFiles, (existing[item.name] as Result) ?? {}, obj);
    } else {
      const ext = path.extname(item.name);
      if ([".svg", ".png", ".jpg"].includes(ext.toLowerCase())) {
        const fileName = path.basename(item.name);
        const relativePath = path.relative(Deno.cwd(), path.resolve(itemPath));
        if (!changedFiles.has(relativePath) && typeof existing[fileName] === "string") {
          result[fileName] = existing[fileName] as string;
        } else {
          result[fileName] = `s${nanoid()}${ext}`;
        }
      }
    }
  }
  return result;
}

function collectLeafKeys(result: Result): Set<string> {
  const keys = new Set<string>();
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "string") {
      keys.add(key);
    } else {
      for (const k of collectLeafKeys(value)) keys.add(k);
    }
  }
  return keys;
}

function loadExistingMeta(dir: string): Record<string, string[]> {
  try {
    return JSON.parse(Deno.readTextFileSync(`${dir}/meta.json`));
  } catch {
    return {};
  }
}

function updateMeta(dir: string, result: Result) {
  const existing = loadExistingMeta(dir);
  const current = collectLeafKeys(result);
  const updated: Record<string, string[]> = {};
  for (const key of current) {
    updated[key] = existing[key] ?? [];
  }
  Deno.writeTextFileSync(`${dir}/meta.json`, JSON.stringify(updated, null, 2));
}

function buildIndex(dir: string, noMeta = false) {
  const changedFiles = getChangedFiles();
  const existing = loadExistingIndex(dir);
  const result = walkDir(dir, changedFiles, existing);
  Deno.writeTextFileSync(`${dir}/index.json`, JSON.stringify(result));
  if (!noMeta) updateMeta(dir, result);
}

const args = Deno.args;
const dir = args[0];
const noMeta = args.includes("--no-meta");

buildIndex(dir, noMeta);

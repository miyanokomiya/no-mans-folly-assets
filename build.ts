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

function walkDir(dir: string, result: Result = {}) {
  const list = Deno.readDirSync(dir);
  for (const item of list) {
    const itemPath = path.join(dir, item.name);
    const stats = Deno.statSync(itemPath);
    if (stats.isDirectory) {
      const obj: Result = {};
      result[item.name] = obj;
      walkDir(itemPath, obj);
    } else {
      const ext = path.extname(item.name);
      if ([".svg", ".png", ".jpg"].includes(ext.toLowerCase())) {
        const fileName = path.basename(item.name);
        result[fileName] = `s${nanoid()}${path.extname(item.name)}`;
      }
    }
  }
  return result;
}

function testWalkDir(dir: string) {
  const result = walkDir(dir);
  Deno.writeTextFileSync(`${dir}/index.json`, JSON.stringify(result));
}

const args = Deno.args;
const dir = args[0];

testWalkDir(dir);

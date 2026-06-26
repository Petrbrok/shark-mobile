import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

let loaded = false;

export function loadEnv() {
  if (loaded) {
    return;
  }
  loaded = true;

  const initialKeys = new Set(Object.keys(process.env));
  loadEnvFile(path.join(process.cwd(), ".env"), initialKeys);
  loadEnvFile(path.join(process.cwd(), ".env.local"), initialKeys);
}

function loadEnvFile(filePath, initialKeys) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const parsed = dotenv.parse(fs.readFileSync(filePath));
  for (const [key, value] of Object.entries(parsed)) {
    if (initialKeys.has(key)) {
      continue;
    }
    process.env[key] = value;
  }
}

import { IGNORED_DIRS, CONFIG_DIR_PATH, CONFIG_FILE_PATH } from '../config/constants.js';
import * as fsp from "fs/promises";
import fs from "fs";
import path from "path";


export function hasConfigFile() {
  const dirPath = CONFIG_DIR_PATH;
  const configFilePath = CONFIG_FILE_PATH;
  return fs.existsSync(configFilePath);
}




const MAX_DEPTH = 10;
const MAX_FILES = 10000;

export async function getCwdStructure(dirPath = process.cwd(), state = { fileCounter: 0 }, depth = 0) {
  if (depth > MAX_DEPTH) return null;
  if (state.fileCounter > MAX_FILES) return null;

  const label = path.basename(dirPath);
  const structure = { label };

  let files;

  try {
    files = await fsp.readdir(dirPath, { withFileTypes: true });
  } catch {
    return null;
  }

  const nodes = [];

  for (const file of files) {
    if (IGNORED_DIRS.includes(file.name)) continue;
    if (file.isSymbolicLink()) continue;

    const fullPath = path.join(dirPath, file.name);

    if (file.isFile()) {
      state.fileCounter++;
      if (state.fileCounter > MAX_FILES) break;

      nodes.push({ label: file.name });
    }

    if (file.isDirectory()) {
      const child = await getCwdStructure(fullPath, state, depth + 1);
      if (child) nodes.push(child);
    }
  }

  if (nodes.length > 0) {
    structure.nodes = nodes;
  }

  return structure;
}

export const getConfig = async () => {
  try {
    const configContent = await fsp.readFile(CONFIG_FILE_PATH, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error("Error reading config file:", error);
    return null;
  }
};
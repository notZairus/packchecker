import archy from "archy";
import fs from "fs/promises";
import path from "path";

import { IGNORED_DIRS } from "../config/constants.js";
import { showWelcomeScreen } from "../ui/displays.js";


export async function main() {
  console.clear();
  await showWelcomeScreen();

  try {
    const state = { fileCounter: 0 };

    const structure = await getCwdStructure(process.cwd(), state);
    console.log(archy(structure));
  } catch (error) {
    console.error("Directory could not be read.");
    process.exit(1);
  }
}




const MAX_DEPTH = 10;
const MAX_FILES = 10000;

async function getCwdStructure(dirPath, state, depth = 0) {
  if (depth > MAX_DEPTH) return null;
  if (state.fileCounter > MAX_FILES) return null;

  const label = path.basename(dirPath);
  const structure = { label };

  let files;

  try {
    files = await fs.readdir(dirPath, { withFileTypes: true });
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
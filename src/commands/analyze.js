import archy from "archy";
import { showWelcomeScreen } from "../ui/displays.js";
import fs from "fs";

export async function main () {
  console.clear();
  await showWelcomeScreen();

  try {
    const structure = getCwdStructure(process.cwd());
    console.log(archy(structure));
  } catch (error) {
    console.error("The directory could not be read. Please make sure you are in the correct directory and try again.");
    process.exit(1);
  }
}



function getCwdStructure (dirPath) {
  const label = dirPath.split("/").pop() || dirPath;
  const structure = { label };
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  const nodes = files
    .filter(file => !["node_modules", ".git", "dist"].includes(file.name))
    .map(file => {
      if (file.isFile()) {
        return { label: file.name };
      }
      if (file.isDirectory()) {
        return getCwdStructure(`${dirPath}/${file.name}`);
      }

      return structure;
    });

  if (nodes.length > 0) {
    structure.nodes = nodes;
  }

  return structure;
}

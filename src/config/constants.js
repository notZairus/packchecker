import os from 'os';
import path from 'path';

export const CONFIG_DIR_PATH = path.join(os.homedir(), '.pack-checker');
export const CONFIG_FILE_PATH = path.join(CONFIG_DIR_PATH, 'config.json');

export const IGNORED_DIRS = [
  "node_modules",
  ".git",
  ".svn",
  ".hg",

  "dist",
  "build",
  "out",
  "target",
  "bin",
  "obj",

  "coverage",
  ".nyc_output",

  "vendor",
  "packages",

  ".cache",
  ".parcel-cache",
  ".next",
  ".nuxt",
  ".svelte-kit",

  ".turbo",
  ".vite",
  ".webpack",
  ".rollup.cache",

  ".idea",
  ".vscode",
  ".vs",

  "__pycache__",
  ".pytest_cache",

  "venv",
  ".venv",
  "env",
  ".env",

  "Pods",
  "DerivedData",

  "android/build",
  "ios/build",

  ".gradle",
  ".mvn",

  "tmp",
  "temp",
  ".tmp",

  "logs",
  "*.log",

  ".dart_tool",
  ".pub-cache",

  "CMakeFiles",

  ".terraform",

  ".serverless",

  ".expo",
  ".expo-shared"
];
import fs from 'fs';
import { CONFIG_DIR_PATH, CONFIG_FILE_PATH } from '../config/constants.js';

export function hasConfigFile() {
  const dirPath = CONFIG_DIR_PATH;
  const configFilePath = CONFIG_FILE_PATH;
  return fs.existsSync(configFilePath);
}
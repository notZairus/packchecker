import os from 'os';
import path from 'path';

export const CONFIG_DIR_PATH = path.join(os.homedir(), '.pack-checker');
export const CONFIG_FILE_PATH = path.join(CONFIG_DIR_PATH, 'config.json');
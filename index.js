#!/usr/bin/env node

import os from 'os';
import path from 'path';
import fs from 'fs';

import { showWelcomeScreen, showLoader } from './lib/displays.js';
import { promptApiKey, isValidApiKey } from './lib/api-key.js';
import p from "./lib/p.js";


async function main() {
	console.clear();
	showWelcomeScreen();
	await showLoader("Setting up Pack Checker...", "Setup complete!", 1000);


	if (!fs.existsSync(path.join(os.homedir(), '.pack-checker', 'config.json'))) {
		const apiKey = await promptApiKey();
		if (!isValidApiKey(apiKey)) {
			p.outro('Invalid API key. Please try again.');
		}
	}
}

main().catch(console.error);
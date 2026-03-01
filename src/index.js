#!/usr/bin/env node
import fs from 'fs';

import { showWelcomeScreen, showLoader } from './ui/displays.js';
import { promptApiKey, isValidApiKey } from './services/gemini.js';
import p from "./config/p.js";
import { hasConfigFile } from './utils/helpers.js';
import { CONFIG_DIR_PATH, CONFIG_FILE_PATH } from './config/constants.js';

async function main() {

	if (! hasConfigFile()) {
		console.clear();
		showWelcomeScreen();
		await showLoader("Setting up Pack Checker...", "Setup complete!", 1000);

		const apiKey = await promptApiKey();

		if (! await isValidApiKey(apiKey)) {
			p.outro('Invalid API key. Please try again.');
			return;
		}

		fs.mkdirSync(CONFIG_DIR_PATH, { recursive: true });	

		fs.writeFileSync(
			CONFIG_FILE_PATH,
			JSON.stringify({ apiKey: apiKey }, null, 2),
			'utf-8'
		);

		p.outro('API key saved successfully!');
	}

	start();
}


async function start() {
	console.clear();
	await showWelcomeScreen();

	p.note("Welcome to Pack Checker, your AI-powered devependency orchestrator and code analyzer! \nLet's get started by selecting an action. Don't worry, you can always come back to this menu to explore other features. \n\nlet's dive into analyzing your code and uncovering insights together!");

	const action = await p.select({
		message: 'Action: ',
		initialValue: 'analyze',
		maxItems: 5,
		options: [
			{ value: 'analyze', label: 'Analyzer' },
		],
	});

	switch (action) {
		case 'analyze': {
			const analyze = await import('./commands/analyze.js');
			analyze.start();
			break;
		}
		default: {
			p.outro('Action not implemented yet. Please select a valid action.');
		}
	}
}



main().catch(console.error);
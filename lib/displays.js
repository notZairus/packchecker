import figlet from 'figlet';
import color from 'picocolors';
import p from "./p.js";
import { setTimeout } from 'node:timers/promises';


export function showWelcomeScreen() {
  figlet.text('Pack Checker', {
    font: "Small",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  }, (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(color.cyan(data));
  });
}

export async function showLoader(start = "Loading...", end = "Done!", duration = 1000) {
  const s = p.spinner();
  s.start(start);
  await setTimeout(duration);
  s.stop(end);
}
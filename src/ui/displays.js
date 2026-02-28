import figlet from 'figlet';
import color from 'picocolors';
import p from "../config/p.js";
import { setTimeout } from 'node:timers/promises';


export async function showWelcomeScreen() {
  await figlet.text('Pack Checker', {
    font: "Slant",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 90,
    whitespaceBreak: true,
  }, (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }

    console.log(color.cyan(data));
  })
}

export async function showLoader(start = "Loading...", end = "Done!", duration = 1000) {
  const s = p.spinner();
  s.start(start);
  await setTimeout(duration);
  s.stop(end);
}
import * as p from '@clack/prompts';

export async function promptApiKey() {
  return p.text({
    message: 'Enter your GEMINI API KEY:',
  });
}


export function isValidApiKey(apiKey) {
  if (typeof apiKey !== 'string') {
    return false;
  }

  if (apiKey.length < 8) {
    return false;
  }
}
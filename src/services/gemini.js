import * as p from '@clack/prompts';
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import os from "os";
import { CONFIG_FILE_PATH } from "../config/constants.js";

export async function promptApiKey() {
  return p.text({
    message: 'Enter your GEMINI API KEY:',
  });
}

export async function isValidApiKey(apiKey) {
  if (typeof apiKey !== 'string') {
    return false;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      config: {
        responseMimeType: "application/json",
      },
      contents: `
        {
          isValid: boolean,
        }
      `,
    });

    if (response && JSON.parse(response.text).isValid) {
      return true;
    }

  } catch (error) {
    return false;
  }
}
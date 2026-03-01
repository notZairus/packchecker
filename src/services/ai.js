import { text } from "@clack/prompts";
import { getConfig } from "../utils/helpers.js";
import { GoogleGenAI } from "@google/genai";
import p from "../config/p.js";


const config = await getConfig();
const apiKey = config ? config.apiKey : null;

if (!apiKey) {
  console.error("GEMINI API KEY not found in configuration.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

export const aiProjectAnalysis = async (projectStructure) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        systemInstructions: [
          {
            text: "You are an expert in analyzing project structure"
          }
        ],
      },
      contents: `
        analyze this ${JSON.stringify(projectStructure, null, 2)} and provide a comprehensive analysis in the following JSON format. Focus on identifying structural issues, potential improvements, and best practices. Be concise but thorough in your analysis.
      
        FORMAT:
        Return ONLY valid JSON in this structure:

        {
          "meta": {
            "projectName": "string",
            "analysisVersion": "1.0",
            "score": 0
          },
          "summary": {
            "overview": "string",
            "health": "good | moderate | poor",
            "keyFindings": ["string"]
          },
          "issues": [
            {
              "id": "ISSUE_001",
              "title": "Short issue title",
              "severity": "low | medium | high",
              "category": "structure | naming | documentation | testing | architecture",
              "filePaths": ["string"],
              "description": "Clear explanation of the problem",
              "impact": "Why this matters",
              "suggestedFix": "Actionable fix"
            }
          ],
          "recommendations": [
            {
              "id": "REC_001",
              "priority": "low | medium | high",
              "title": "Short recommendation title",
              "description": "What should be done",
              "expectedBenefit": "Why this improves the project"
            }
          ],
          "bestPractices": [
            {
              "title": "Practice name",
              "status": "implemented | missing | partial",
              "notes": "Short explanation"
            }
          ]
        }
      `,
    });

    return JSON.parse(response.text);
  } catch (error) {
    if (error.code === 429) {
      p.outro(color.red("Rate limit exceeded. Please try again later."));
    }

    return null;
  }
};


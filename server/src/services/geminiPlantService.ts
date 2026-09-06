import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({ apiKey });

export interface PlantIdentification {
  identified: boolean;
  commonName: string | null;
  scientificName: string | null;
  needsBetterPhoto: boolean;
}

export async function identifyPlant(
  imageBuffer: Buffer,
  mimeType: string
): Promise<PlantIdentification> {
  const base64Image = imageBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",

    contents: [
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: `
Identify the plant or flower in this image.

This application is designed for plants and trees found around Melbourne,
Australia.

If you cannot identify the plant with reasonable confidence, do not guess.

Return:
- whether the plant was identified
- its common name
- its scientific name
- whether a better photo is needed
        `,
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          identified: {
            type: "boolean",
          },

          commonName: {
            type: ["string", "null"],
          },

          scientificName: {
            type: ["string", "null"],
          },

          needsBetterPhoto: {
            type: "boolean",
          },
        },

        required: [
          "identified",
          "commonName",
          "scientificName",
          "needsBetterPhoto",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(response.text) as PlantIdentification;
}
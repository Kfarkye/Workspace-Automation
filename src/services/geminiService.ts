import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const gemini = {
  detectIntent: async (input: string) => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following user request for a Google Workspace automation and classify its primary intent.
      
      User request: "${input}"
      
      Classification schema:
      - SUMMARIZE_EMAIL: Wants to summarize one or many emails.
      - EXTRACT_DATA: Wants to extract specific data (like invoice info, addresses, logistics) from emails or docs into a structured format like Sheets.
      - GENERATE_REPORT: Wants to create a document or report based on existing data.
      - UNKNOWN: Intent is unclear.
      
      Return JSON with fields: intent (string), entities (array of strings), reasoning (string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            entities: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING }
          },
          required: ["intent", "entities", "reasoning"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch {
      return { intent: "UNKNOWN", entities: [], reasoning: "Failed to parse AI response." };
    }
  },

  summarizeEmail: async (content: string) => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this email chain concisely, highlighting action items and key dates.
      
      Content:
      ${content}
      
      Format the output as a professional executive summary.`,
    });
    return response.text;
  },

  extractEntities: async (content: string) => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract structured data from this text. Focus on vendor names, amounts, dates, and locations.
      
      Text:
      ${content}
      
      Return JSON array of extracted objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              vendor: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              date: { type: Type.STRING },
              location: { type: Type.STRING },
              item: { type: Type.STRING }
            }
          }
        }
      }
    });
    try {
      return JSON.parse(response.text || "[]");
    } catch {
      return [];
    }
  }
};

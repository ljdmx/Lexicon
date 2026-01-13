
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async translateContent(content: string, targetLanguage: string): Promise<string> {
    // Strictly follow SDK initialization rules
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // System instruction separates the logic from the data, improving reliability
    const systemInstruction = `You are a professional localization engine for technical and structured data.
Translate the natural language values in the provided input into ${targetLanguage}.

STRICT CONSTRAINTS:
1. Preserve all structural syntax: XML tags (e.g., <identity>, <capabilities>), JSON keys, and formatting.
2. Do not translate code, variables, or placeholders (e.g., {{...}}, %s, [var]).
3. Maintain exactly the original indentation, whitespace, and newline structure.
4. Output ONLY the localized data. No conversational filler or markdown code blocks.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: content }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0,
          // Removed responseMimeType to handle flexible formats (XML/JSON/Markdown)
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("The AI returned an empty response.");
      }
      
      return text;
    } catch (error: any) {
      console.error("Gemini Internal Communication Error:", error);
      // Re-throw a more user-friendly error message
      throw new Error(error.message || "Failed to communicate with AI service.");
    }
  }
}

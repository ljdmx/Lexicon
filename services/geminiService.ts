
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
    // CRITICAL: Create a new instance right before the call to pick up latest API key
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      throw new Error("API_KEY_MISSING: Please configure your API key in the top-right corner.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
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
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("The AI returned an empty response.");
      }
      
      return text;
    } catch (error: any) {
      console.error("Gemini Communication Error:", error);
      
      // Pass through specific error for UI handling
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API_KEY_INVALID")) {
        throw new Error("AUTH_REQUIRED: Your API key is invalid or has expired. Re-configuration required.");
      }
      
      throw new Error(error.message || "Failed to communicate with AI service.");
    }
  }
}

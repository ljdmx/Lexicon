
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
    // CRITICAL: Order of precedence for API keys:
    // 1. process.env.API_KEY (System/Dev setting)
    // 2. localStorage (Manual User Config)
    let apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === 'undefined') {
      apiKey = localStorage.getItem('lexicon_manual_api_key') || '';
    }
    
    if (!apiKey) {
      throw new Error("AUTH_REQUIRED: Please configure your API key by clicking the status icon.");
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
      
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API_KEY_INVALID") || error.message?.includes("invalid API key")) {
        throw new Error("AUTH_REQUIRED: Your API key is invalid or has expired. Re-configuration required.");
      }
      
      throw new Error(error.message || "Failed to communicate with AI service.");
    }
  }
}

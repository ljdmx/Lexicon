
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
    let apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === 'undefined') {
      apiKey = localStorage.getItem('lexicon_manual_api_key') || '';
    }
    
    if (!apiKey) {
      throw new Error("AUTH_REQUIRED");
    }

    // Rough check for extreme length to avoid silent failures
    if (content.length > 30000) {
      throw new Error("CONTENT_TOO_LARGE");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Optimized, token-efficient system instruction
    const systemInstruction = `Role: Technical Localization Engine.
Task: Translate values into ${targetLanguage}.
Rules:
- PRESERVE: Structure, keys, XML tags, whitespace, placeholders ({{}}, %s).
- IGNORE: Code, variables, logic.
- OUTPUT: Raw structural data ONLY. No markdown or meta-talk.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: content }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1, // Slight entropy for natural translation while keeping structure rigid
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("EMPTY_RESPONSE");
      }
      
      return text;
    } catch (error: any) {
      console.error("Gemini Communication Error:", error);
      
      const errStr = error.toString();
      if (errStr.includes("401") || errStr.includes("403") || errStr.includes("API_KEY_INVALID") || errStr.includes("not found")) {
        throw new Error("AUTH_REQUIRED");
      }
      if (errStr.includes("429") || errStr.includes("quota")) {
        throw new Error("RATE_LIMIT");
      }
      if (errStr.includes("finishReason: SAFETY") || errStr.includes("finishReason: OTHER")) {
        throw new Error("GENERAL_ERROR");
      }
      
      throw new Error(error.message || "GENERAL_ERROR");
    }
  }
}

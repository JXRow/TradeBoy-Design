
import { GoogleGenAI } from "@google/genai";
import { Coin } from "../types";

// Fix: Directly use process.env.API_KEY for initializing the GoogleGenAI instance as per the coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCoin = async (coin: Coin): Promise<string> => {
  try {
    const prompt = `
      You are "The Operator" in a cyberpunk/matrix world. The user is jacked in.
      Target Code: ${coin.symbol} (${coin.name}).
      Current Value: ${coin.price}.
      Flux (24h): ${coin.change24h}%.
      
      Provide a tactical assessment. Is this a glitch to exploit (Buy), a system crash (Sell), or static noise (Hold)?
      Use techno-babble, be cryptic but clear on the action. Max 25 words.
      Format: "STATUS: [Verdict]. [Reasoning]."
    `;

    // Fix: Use ai.models.generateContent with model and contents directly.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: Access .text property directly instead of calling it as a method.
    return response.text || "SIGNAL_LOST.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CONNECTION_SEVERED. RETRY.";
  }
};

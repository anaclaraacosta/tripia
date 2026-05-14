import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
      contents: "Return exactly {'ok': true} as JSON",
      config: { responseMimeType: "application/json" }
    });
    console.log("Type of response.text:", typeof response.text);
    console.log("response.text value:", response.text);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();

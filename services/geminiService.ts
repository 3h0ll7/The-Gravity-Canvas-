import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiThemeResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize GenAI
const ai = new GoogleGenAI({ apiKey });

const themeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    themeName: { type: Type.STRING },
    description: { type: Type.STRING },
    wells: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          x: { type: Type.NUMBER, description: "Normalized X position (0.0 to 1.0)" },
          y: { type: Type.NUMBER, description: "Normalized Y position (0.0 to 1.0)" },
          mass: { type: Type.NUMBER, description: "Mass between 1000 and 5000" },
          color: { type: Type.STRING, description: "Hex color code for the well" }
        },
        required: ["x", "y", "mass", "color"]
      }
    },
    backgroundStyle: { type: Type.STRING, description: "Hex color for background" }
  },
  required: ["themeName", "description", "wells", "backgroundStyle"]
};

export const generateTheme = async (prompt: string): Promise<GeminiThemeResponse | null> => {
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Create a physics simulation configuration for a gravity art canvas based on this concept: "${prompt}". 
          The configuration should include positions and masses for gravity wells. 
          Return between 2 and 6 gravity wells. 
          Make the masses strong enough to bend particle trajectories (range 1000-5000).
          Choose neon/glowing colors.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: themeSchema,
      }
    });

    const text = result.response.text();
    if (!text) return null;
    
    return JSON.parse(text) as GeminiThemeResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

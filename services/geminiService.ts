
import { GoogleGenAI, Type } from "@google/genai";
import { HealthLog, UserProfile } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getTriageAnalysis = async (symptoms: string[], profile: UserProfile) => {
  if (!API_KEY) return "AI services are currently unavailable. Please contact your doctor directly for emergencies.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `
    User is ${profile.deliveryType} postpartum (Date: ${profile.deliveryDate}).
    Symptoms reported: ${symptoms.join(", ")}.
    Provide a clinical triage assessment. 
    Differentiate between normal recovery discomfort and red flags (e.g., mastitis, infection, DVT, severe PPD).
    Structure:
    1. Assessment
    2. Recommended Action (Rest, Consult OBGYN, or Immediate ER)
    3. Self-care tips.
    Be empathetic and supportive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a clinical postpartum triage assistant. Your goal is to provide evidence-based, supportive guidance for new mothers. Always emphasize contacting a doctor if symptoms persist.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating analysis. Please seek medical advice.";
  }
};

export const getDailyInspiration = async (mood: number) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Generate a short, calming, and validating 2-sentence inspiration for a new mother feeling a mood of ${mood}/10 (10 being great).`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch {
    return "You are doing an amazing job. Take it one breath at a time.";
  }
};

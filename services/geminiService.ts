
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

// Removed global API_KEY definition to use process.env.API_KEY directly in constructors as required.
// Using 'gemini-3-pro-preview' for the reasoning-heavy triage task and 'gemini-3-flash-preview' for simple inspiration text.

export const getTriageAnalysis = async (symptoms: string[], profile: UserProfile) => {
  // Always initialize GoogleGenAI with { apiKey: process.env.API_KEY } directly before usage.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a clinical postpartum triage assistant. Your goal is to provide evidence-based, supportive guidance for new mothers. Always emphasize contacting a doctor if symptoms persist.",
      },
    });
    // Access the .text property directly.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating analysis. Please seek medical advice.";
  }
};

export const getDailyInspiration = async (mood: number) => {
  // Use gemini-3-flash-preview for basic text tasks like short validations.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a short, calming, and validating 2-sentence inspiration for a new mother feeling a mood of ${mood}/10 (10 being great).`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Access the .text property directly.
    return response.text;
  } catch {
    return "You are doing an amazing job. Take it one breath at a time.";
  }
};

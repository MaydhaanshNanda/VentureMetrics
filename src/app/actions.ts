'use server';

import { GoogleGenAI } from '@google/genai';
import { EvaluationResult } from '@/types';

// Enforce standard JSON schema for Gemini response
const schema = {
  type: "OBJECT",
  properties: {
    startupName: { type: "STRING" },
    startupDescription: { type: "STRING" },
    overallScore: { type: "INTEGER" },
    marketPotentialScore: { type: "INTEGER" },
    marketPotentialAnalysis: { type: "STRING" },
    scalabilityScore: { type: "INTEGER" },
    scalabilityAnalysis: { type: "STRING" },
    revenueModels: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          model: { type: "STRING" },
          description: { type: "STRING" },
          viability: { type: "STRING", enum: ["High", "Medium", "Low"] }
        },
        required: ["model", "description", "viability"]
      }
    },
    majorRisks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          risk: { type: "STRING" },
          impact: { type: "STRING", enum: ["High", "Medium", "Low"] },
          mitigation: { type: "STRING" }
        },
        required: ["risk", "impact", "mitigation"]
      }
    },
    competitors: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          differentiation: { type: "STRING" }
        },
        required: ["name", "differentiation"]
      }
    },
    summary: { type: "STRING" }
  },
  required: [
    "startupName",
    "startupDescription",
    "overallScore",
    "marketPotentialScore",
    "marketPotentialAnalysis",
    "scalabilityScore",
    "scalabilityAnalysis",
    "revenueModels",
    "majorRisks",
    "competitors",
    "summary"
  ]
};

export async function evaluateStartupAction(name: string, description: string): Promise<
  { success: true; data: EvaluationResult } | { success: false; error: string }
> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      error: 'GEMINI_API_KEY is not configured in .env.local. Please get an API key from Google AI Studio (https://aistudio.google.com/) and paste it in the .env.local file.',
    };
  }

  if (!name || name.trim() === '') {
    return {
      success: false,
      error: 'Startup name is required.',
    };
  }

  if (!description || description.trim() === '') {
    return {
      success: false,
      error: 'Startup description is required.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Evaluate the following startup concept.
    Name: ${name}
    Description: ${description}

    Provide a detailed evaluation conforming strictly to the requested schema. Make sure to:
    1. Assess the overall score out of 100 based on market viability, risks, scalability, and differentiator features.
    2. Provide a realistic market potential score and analysis.
    3. Provide a scalability score and analysis.
    4. Propose 3 solid revenue model suggestions.
    5. Outline at least 3 major risks with practical mitigation strategies.
    6. Conduct a brief competitor analysis pointing out potential competitors and differentiation.
    7. Provide a concise executive summary of the evaluation.`;

    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError = null;
    let response = null;

    for (const model of models) {
      try {
        response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema as any,
          },
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed or is currently busy:`, err.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('All Gemini evaluation models are currently busy or unavailable. Please try again in a few moments.');
    }

    const data = JSON.parse(response.text) as EvaluationResult;
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error evaluating startup:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during evaluation. Please try again.',
    };
  }
}

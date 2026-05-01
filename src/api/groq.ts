'use server';
/**
 * @fileOverview DRAPE AI Groq integration via Genkit.
 * Provides high-fashion styling recommendations and analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { withRetry } from '@/lib/api-utils';

const SYSTEM_PROMPT = `You are DRAPE AI, a luxury fashion stylist for Indian users. You specialize in recommending outfits based on body shape, skin tone, height, budget, and occasion. Always recommend specific clothing items with Indian fashion context. Consider Indian fashion brands, festivals, weather, and cultural occasions. Return structured JSON responses.`;

const OutfitItemSchema = z.object({
  type: z.string(),
  description: z.string(),
  brand: z.string().optional(),
  approxPrice: z.number().optional(),
  searchTerms: z.string().describe('Keywords to find this item on e-commerce platforms'),
});

const OutfitRecommendationSchema = z.object({
  name: z.string(),
  description: z.string(),
  items: z.array(OutfitItemSchema),
  whyItWorks: z.string(),
  occasionMatch: z.string(),
});

/**
 * Generates outfit suggestions based on user profile and context.
 */
export async function getOutfitSuggestions(
  bodyShape: string,
  skinTone: string,
  height: string,
  budget: number,
  occasion: string
) {
  return withRetry(async () => {
    const { output } = await ai.generate({
      system: SYSTEM_PROMPT,
      prompt: `Recommend 3 luxury outfits for a ${bodyShape} body shape, ${skinTone} skin tone, ${height} height, within a budget of ₹${budget} for a ${occasion}.`,
      output: { schema: z.array(OutfitRecommendationSchema) },
    });
    return output || [];
  });
}

/**
 * Returns a detailed style guide for a specific body and skin tone combination.
 */
export async function getStyleExplanation(bodyShape: string, skinTone: string) {
  return withRetry(async () => {
    const { text } = await ai.generate({
      system: SYSTEM_PROMPT,
      prompt: `Provide a detailed style guide for someone with a ${bodyShape} body shape and ${skinTone} skin tone. Focus on silhouettes and fabric types.`,
    });
    return text;
  });
}

/**
 * Returns a recommended color palette based on skin tone.
 */
export async function getColorPalette(skinTone: string) {
  return withRetry(async () => {
    const { output } = await ai.generate({
      system: SYSTEM_PROMPT,
      prompt: `Recommend a high-fashion color palette for ${skinTone} skin tone. Also list colors to avoid.`,
      output: {
        schema: z.object({
          recommended: z.array(z.string()),
          avoid: z.array(z.string()),
        }),
      },
    });
    return output;
  });
}

/**
 * Generates alternative variations for a specific outfit.
 */
export async function generateOutfitVariations(outfitDescription: string, preference: string) {
  return withRetry(async () => {
    const { output } = await ai.generate({
      system: SYSTEM_PROMPT,
      prompt: `Generate 2 alternative variations for this outfit: "${outfitDescription}". The user prefers: "${preference}".`,
      output: { schema: z.array(OutfitRecommendationSchema) },
    });
    return output || [];
  });
}

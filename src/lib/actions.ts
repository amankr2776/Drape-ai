'use server';
/**
 * @fileOverview Server Actions for the DRAPE AI frontend.
 */

import { getOutfitSuggestions, getColorPalette, getStyleExplanation } from '@/api/groq';
import { analyzeBodyShape, detectSkinTone } from '@/api/bodyAnalysis';
import { compareAcrossPlatforms } from '@/api/priceCompare';
import { outfitFeedbackRefinement } from '@/ai/flows/outfit-feedback-refinement-flow';
import type { OutfitFeedbackRefinementInput } from '@/ai/flows/outfit-feedback-refinement-flow';

// Mock user for prototype
const DEFAULT_USER_ID = 'user_12345';

/**
 * Performs full style analysis and generates recommendations.
 */
export async function performFullAnalysis(photoDataUri: string, occasion: string, budget: number) {
  try {
    // 1. Image Analysis
    const [body, skin] = await Promise.all([
      analyzeBodyShape(photoDataUri),
      detectSkinTone(photoDataUri),
    ]);

    // 2. AI Suggestions
    const suggestions = await getOutfitSuggestions(
      body.bodyShape,
      skin.toneName,
      '5\'6"', // mock height
      budget,
      occasion
    );

    // 3. Price Comparison for the first suggestion
    const firstItem = suggestions[0]?.items[0];
    const deals = firstItem 
      ? await compareAcrossPlatforms(firstItem.searchTerms)
      : [];

    return {
      body,
      skin,
      suggestions,
      topDeals: deals,
      error: null,
    };
  } catch (e) {
    console.error('Analysis failed:', e);
    return { error: 'Failed to complete style analysis. Please try again.' };
  }
}

/**
 * Gets static style guide and palette info.
 */
export async function getStyleIntelligence(bodyShape: string, skinTone: string) {
  try {
    const [guide, palette] = await Promise.all([
      getStyleExplanation(bodyShape, skinTone),
      getColorPalette(skinTone),
    ]);
    return { guide, palette, error: null };
  } catch (e) {
    return { error: 'Failed to fetch style intelligence.' };
  }
}

/**
 * Legacy support for current dashboard (to be replaced by performFullAnalysis)
 */
export async function getOutfitRecommendation(
  prevState: any,
  formData: FormData
) {
  const occasion = formData.get('occasion') as string;
  const weather = formData.get('weather') as string;

  if (!occasion || !weather) {
    return { recommendation: null, error: 'Occasion and weather are required.' };
  }

  try {
    const suggestions = await getOutfitSuggestions(
      'Hourglass', 
      'Medium', 
      '5\'4"', 
      5000, 
      occasion
    );
    // Transform back to the old UI expected format
    const recommendation = {
      outfitName: suggestions[0].name,
      description: suggestions[0].description,
      items: suggestions[0].items.map(i => ({
        type: i.type,
        description: i.description,
        stylingTips: 'Style with confidence.'
      })),
      overallStylingTips: suggestions[0].whyItWorks,
      moodBoardKeywords: ['elegant', 'chic'],
    };
    return { recommendation, error: null };
  } catch (e) {
    return { recommendation: null, error: 'Failed to generate recommendation.' };
  }
}

export async function submitFeedback(
    input: Omit<OutfitFeedbackRefinementInput, 'userId' | 'recommendationId' | 'currentStyleProfile'>
) {
    try {
        const fullInput: OutfitFeedbackRefinementInput = {
            ...input,
            userId: DEFAULT_USER_ID,
            recommendationId: `rec-${Date.now()}`,
            currentStyleProfile: 'Minimalist, loves handloom, pear-shaped.',
        };
        const result = await outfitFeedbackRefinement(fullInput);
        return result;
    } catch (e) {
        return { error: 'Failed to submit feedback.' };
    }
}

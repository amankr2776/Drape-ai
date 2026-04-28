'use server';
import { aiOutfitRecommendation } from '@/ai/flows/ai-outfit-recommendation-flow';
import type { AiOutfitRecommendationInput, AiOutfitRecommendationOutput } from '@/ai/flows/ai-outfit-recommendation-flow';
import { outfitFeedbackRefinement } from '@/ai/flows/outfit-feedback-refinement-flow';
import type { OutfitFeedbackRefinementInput, OutfitFeedbackRefinementOutput } from '@/ai/flows/outfit-feedback-refinement-flow';

// Dummy user profile for now
const userProfile = {
  stylePreferences: 'Minimalist with a touch of bohemian, loves handloom fabrics, and modern silhouettes.',
  bodyMeasurements: 'Height 5\'4", size S, pear-shaped figure.',
  inspiration: 'Sabyasachi campaigns, old Bollywood glamour, Vogue India editorials.',
  occasionRequirements: 'Prefers outfits that can be styled for both day and evening events, values comfort and elegance.',
};

export async function getOutfitRecommendation(
  prevState: any,
  formData: FormData
): Promise<{ recommendation: AiOutfitRecommendationOutput | null; error: string | null }> {
  const occasion = formData.get('occasion') as string;
  const weather = formData.get('weather') as string;

  if (!occasion || !weather) {
    return { recommendation: null, error: 'Occasion and weather are required.' };
  }

  try {
    const input: AiOutfitRecommendationInput = {
      userProfile,
      occasion,
      weather,
    };
    const recommendation = await aiOutfitRecommendation(input);
    return { recommendation, error: null };
  } catch (e) {
    console.error(e);
    return { recommendation: null, error: 'Failed to generate recommendation. Please try again.' };
  }
}

export async function submitFeedback(
    input: Omit<OutfitFeedbackRefinementInput, 'userId' | 'recommendationId' | 'currentStyleProfile'>
): Promise<OutfitFeedbackRefinementOutput | { error: string }> {
    try {
        const fullInput: OutfitFeedbackRefinementInput = {
            ...input,
            userId: 'user-123', // dummy id
            recommendationId: `rec-${Date.now()}`, // dummy id
            currentStyleProfile: JSON.stringify(userProfile),
        };
        const result = await outfitFeedbackRefinement(fullInput);
        return result;
    } catch (e) {
        console.error(e);
        return { error: 'Failed to submit feedback.' };
    }
}

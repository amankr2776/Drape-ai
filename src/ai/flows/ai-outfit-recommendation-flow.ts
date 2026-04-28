'use server';
/**
 * @fileOverview This file implements an AI agent that provides personalized, high-fashion outfit recommendations.
 *
 * - aiOutfitRecommendation - A function that generates an outfit recommendation.
 * - AiOutfitRecommendationInput - The input type for the aiOutfitRecommendation function.
 * - AiOutfitRecommendationOutput - The return type for the aiOutfitRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiOutfitRecommendationInputSchema = z.object({
  userProfile: z
    .object({
      stylePreferences: z.string().describe('User\\\'s preferred styles (e.g., minimalist, bohemian, traditional Indian).'),
      bodyMeasurements: z
        .string()
        .describe('User\\\'s body measurements and figure description (e.g., height 5\\\'6", size M, hourglass figure).'),
      inspiration: z.string().describe('User\\\'s style inspirations (e.g., Vogue India editorials, specific celebrity looks).'),
      occasionRequirements: z
        .string()
        .describe('Any specific requirements for outfits based on typical occasions (e.g., needs comfortable but elegant options for long events).'),
    })
    .describe('Detailed styling profile of the user.'),
  occasion: z.string().describe('The occasion for which the outfit is needed (e.g., \'wedding reception\', \'casual brunch\', \'business meeting\').'),
  weather: z.string().describe('Real-time weather conditions relevant to the outfit (e.g., \'sunny, 30°C, high humidity\', \'chilly, 15°C, light rain\').'),
});
export type AiOutfitRecommendationInput = z.infer<typeof AiOutfitRecommendationInputSchema>;

const AiOutfitRecommendationOutputSchema = z.object({
  outfitName: z.string().describe('A creative, high-fashion name for the recommended outfit.'),
  description: z.string().describe('An editorial-style description of the complete outfit, emphasizing its luxury and aesthetic appeal.'),
  items: z
    .array(
      z.object({
        type: z
          .string()
          .describe('The type of clothing or accessory item (e.g., \'sari\', \'blouse\', \'heels\', \'jewelry\', \'clutch\').'),
        description: z
          .string()
          .describe('A detailed description of the specific item, including materials, colors, and unique features.'),
        stylingTips: z.string().describe('Specific styling advice for this particular item within the outfit context.'),
      })
    )
    .describe('A list of individual clothing and accessory items that make up the outfit.'),
  overallStylingTips: z.string().describe('General styling tips and recommendations for wearing the entire ensemble, considering the user\\\'s profile and occasion.'),
  moodBoardKeywords: z.array(z.string()).describe('Keywords suitable for a high-fashion mood board (e.g., \'opulent\', \'regal\', \'contemporary\', \'ethnic chic\').'),
});
export type AiOutfitRecommendationOutput = z.infer<typeof AiOutfitRecommendationOutputSchema>;

export async function aiOutfitRecommendation(
  input: AiOutfitRecommendationInput
): Promise<AiOutfitRecommendationOutput> {
  return aiOutfitRecommendationFlow(input);
}

const aiOutfitRecommendationPrompt = ai.definePrompt({
  name: 'aiOutfitRecommendationPrompt',
  input: {schema: AiOutfitRecommendationInputSchema},
  output: {schema: AiOutfitRecommendationOutputSchema},
  prompt: `You are DRAPE AI, a premium, intelligent fashion stylist for Indian users. Your goal is to generate personalized, high-fashion outfit recommendations that feel like they belong in a luxury editorial magazine.

Adhere strictly to the DRAPE AI design philosophy:
- Aesthetic: Luxury editorial magazine meets futuristic AI — think Vogue India x Sci-Fi.
- Color Palette: Deep obsidian black (#0A0A0F), warm gold (#C9A84C), soft ivory (#F5F0E8), deep rose (#C4545A).

Based on the following user profile, occasion, and real-time weather, create a sophisticated and stylish outfit recommendation.

User Styling Profile:
- Style Preferences: {{{userProfile.stylePreferences}}}
- Body Measurements/Figure: {{{userProfile.bodyMeasurements}}}
- Inspiration: {{{userProfile.inspiration}}}
- Occasion Requirements: {{{userProfile.occasionRequirements}}}

Occasion: {{{occasion}}}
Weather: {{{weather}}}

Generate an outfit recommendation that includes a creative, high-fashion outfit name, a detailed editorial description, a list of individual items with specific descriptions and styling tips, overall styling tips for the ensemble, and mood board keywords.

Ensure the tone is sophisticated, luxurious, and aspirational. Focus on high-quality fabrics, unique designs, and thoughtful accessorizing that aligns with Indian fashion sensibilities and global high-fashion trends.
`,
});

const aiOutfitRecommendationFlow = ai.defineFlow(
  {
    name: 'aiOutfitRecommendationFlow',
    inputSchema: AiOutfitRecommendationInputSchema,
    outputSchema: AiOutfitRecommendationOutputSchema,
  },
  async input => {
    const {output} = await aiOutfitRecommendationPrompt(input);
    return output!;
  }
);

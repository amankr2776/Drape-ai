'use server';
/**
 * @fileOverview This file implements a Genkit flow for processing user feedback on outfit recommendations.
 *
 * - outfitFeedbackRefinement - A function that handles processing user feedback and refining their style profile.
 * - OutfitFeedbackRefinementInput - The input type for the outfitFeedbackRefinement function.
 * - OutfitFeedbackRefinementOutput - The return type for the outfitFeedbackRefinement function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OutfitFeedbackRefinementInputSchema = z.object({
  userId: z.string().describe('The unique identifier for the user providing feedback.'),
  recommendationId: z.string().describe('The unique identifier of the outfit recommendation being reviewed.'),
  feedbackType: z.enum(['liked', 'disliked', 'needs_refinement']).describe('The type of feedback provided: liked, disliked, or needs_refinement.').default('needs_refinement'),
  comments: z.string().optional().describe('Optional detailed comments from the user regarding the outfit.'),
  currentStyleProfile: z.string().describe('A comprehensive summary of the user\'s current style preferences and profile, used as context for refinement.'),
  recommendedOutfitDescription: z.string().describe('A detailed description of the outfit that was recommended to the user.'),
});
export type OutfitFeedbackRefinementInput = z.infer<typeof OutfitFeedbackRefinementInputSchema>;

const OutfitFeedbackRefinementOutputSchema = z.object({
  feedbackProcessed: z.boolean().describe('Indicates whether the feedback was successfully processed.'),
  styleProfileRefinement: z.string().describe('The AI\'s updated understanding and refinement of the user\'s style profile based on the feedback.'),
  thankYouMessage: z.string().describe('A polite message to the user acknowledging their feedback.'),
});
export type OutfitFeedbackRefinementOutput = z.infer<typeof OutfitFeedbackRefinementOutputSchema>;

export async function outfitFeedbackRefinement(input: OutfitFeedbackRefinementInput): Promise<OutfitFeedbackRefinementOutput> {
  return outfitFeedbackRefinementFlow(input);
}

const feedbackPrompt = ai.definePrompt({
  name: 'outfitFeedbackRefinementPrompt',
  input: { schema: OutfitFeedbackRefinementInputSchema },
  output: { schema: OutfitFeedbackRefinementOutputSchema },
  prompt: `You are DRAPE AI, a sophisticated AI fashion stylist. Your core task is to process user feedback on a previously recommended outfit and leverage this feedback to refine the user's personal style profile. This refinement is critical for providing increasingly accurate and relevant future recommendations.

Here is the information you need to process:

User ID: {{{userId}}}
Recommendation ID: {{{recommendationId}}}
Recommended Outfit Description: {{{recommendedOutfitDescription}}}
Feedback Type: {{{feedbackType}}}
Comments: {{{comments}}}

User's Current Style Profile Summary:
{{{currentStyleProfile}}}

Based on the provided feedback, perform the following actions:
1. Update the 'styleProfileRefinement' field with a refined version of the user's style profile. Analyze the 'feedbackType' and 'comments' (if provided) to extract actionable insights. If the feedback is negative ('disliked' or 'needs_refinement'), try to infer what specific elements or aspects the user disliked to prevent similar future recommendations. If the feedback is positive ('liked'), identify what aspects were particularly appreciated. If no specific refinement can be made, subtly rephrase or confirm the existing profile. The output should be a coherent summary of the user's style.
2. Set 'feedbackProcessed' to true upon successful processing.
3. Generate a 'thankYouMessage' to the user, acknowledging their feedback and reassuring them that it will be used to improve future recommendations. The tone should be luxurious, appreciative, and professional.
`,
});

const outfitFeedbackRefinementFlow = ai.defineFlow(
  {
    name: 'outfitFeedbackRefinementFlow',
    inputSchema: OutfitFeedbackRefinementInputSchema,
    outputSchema: OutfitFeedbackRefinementOutputSchema,
  },
  async (input) => {
    const { output } = await feedbackPrompt(input);
    return output!;
  }
);

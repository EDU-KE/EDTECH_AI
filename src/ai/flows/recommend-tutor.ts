
'use server';
/**
 * @fileOverview An AI agent that recommends a tutor based on a subject.
 *
 * - recommendTutor - A function that handles the tutor recommendation.
 * - RecommendTutorInput - The input type for the function.
 * - RecommendTutorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {onlineTutors} from '@/lib/mock-data';
import {z} from 'genkit';

const RecommendTutorInputSchema = z.object({
  subject: z.string().describe('The subject the student needs help with.'),
});
export type RecommendTutorInput = z.infer<typeof RecommendTutorInputSchema>;

const TutorSchema = z.object({
    id: z.string(),
    name: z.string(),
    specialty: z.string(),
    rating: z.number(),
    avatar: z.string(),
    hint: z.string(),
    contact: z.string(),
});

const RecommendTutorOutputSchema = z.object({
  recommendation: z.string().describe('A brief, encouraging recommendation message explaining why this tutor is a good fit.'),
  tutor: TutorSchema.describe('The details of the recommended tutor.'),
});
export type RecommendTutorOutput = z.infer<typeof RecommendTutorOutputSchema>;

export async function recommendTutor(input: RecommendTutorInput): Promise<RecommendTutorOutput> {
  return recommendTutorFlow(input);
}

const prompt = ai.definePrompt({
    name: 'recommendTutorPrompt',
    input: { schema: z.object({ subject: z.string(), tutor: TutorSchema }) },
    output: { schema: z.object({ recommendation: z.string() }) },
    prompt: `You are an academic advisor. A student is looking for a tutor for the subject '{{{subject}}}'.
    I have identified the highest-rated tutor available: Their name is {{{tutor.name}}} and they have a rating of {{{tutor.rating}}} out of 5.

    Generate a short, encouraging recommendation message for the student. Mention the tutor's name and why they are a great choice based on their high rating.`,
});

const recommendTutorFlow = ai.defineFlow(
  {
    name: 'recommendTutorFlow',
    inputSchema: RecommendTutorInputSchema,
    outputSchema: RecommendTutorOutputSchema,
  },
  async ({ subject }) => {
    // In a real app, this logic would likely be a tool that queries a database of tutors.
    // For this prototype, we'll filter the mock data directly.
    const tutorsForSubject = onlineTutors.filter(t => t.specialty.toLowerCase() === subject.toLowerCase());

    if (tutorsForSubject.length === 0) {
      throw new Error(`No tutors available for ${subject}`);
    }

    // Find the highest-rated tutor for the subject.
    const bestTutor = tutorsForSubject.reduce((prev, current) => (prev.rating > current.rating) ? prev : current);

    const {output} = await prompt({ subject, tutor: bestTutor });

    return {
      recommendation: output!.recommendation,
      tutor: bestTutor,
    };
  }
);

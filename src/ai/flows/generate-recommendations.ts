'use server';
/**
 * @fileOverview Generates learning resource recommendations.
 *
 * - generateRecommendations - A function that generates recommendations.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecommendationsInputSchema = z.object({
  subject: z.string().describe('The subject for which to get recommendations (e.g., Math, Science).'),
  topic: z.string().describe('The specific topic within the subject (e.g., Photosynthesis, Quadratic Equations).'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const ResourceSchema = z.object({
    type: z.string().describe('Type of the resource, e.g., "Article", "Video", "Interactive Tutorial".'),
    title: z.string().describe('The title of the resource.'),
    url: z.string().url().describe('A URL to the resource.'),
    description: z.string().describe('A brief description of why this resource is recommended.'),
});

const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z.array(ResourceSchema).describe('A list of recommended learning resources.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an expert curriculum designer and AI assistant for students.

  A student needs recommendations for learning resources on a specific topic. Based on the subject and topic provided, generate a list of 3-5 high-quality, diverse, and helpful learning resources.

  Provide a mix of resource types like articles, videos, and interactive tutorials. For each resource, provide a title, a valid URL, and a short description of what makes it useful.

  Subject: {{{subject}}}
  Topic: {{{topic}}}`,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

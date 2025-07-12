'use server';
/**
 * @fileOverview Generates a scheme of work for a given subject and grade level.
 *
 * - generateSchemeOfWork - A function that generates the scheme of work.
 * - GenerateSchemeOfWorkInput - The input type for the function.
 * - GenerateSchemeOfWorkOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSchemeOfWorkInputSchema = z.object({
  subject: z.string().describe('The subject for the scheme of work (e.g., Physics).'),
  gradeLevel: z.string().describe('The grade level or year group (e.g., 10th Grade).'),
  termDuration: z.string().describe('The duration of the academic term (e.g., 12 weeks).'),
});
export type GenerateSchemeOfWorkInput = z.infer<typeof GenerateSchemeOfWorkInputSchema>;

const GenerateSchemeOfWorkOutputSchema = z.object({
  schemeOfWork: z.string().describe('A week-by-week scheme of work, outlining topics, learning objectives, and suggested activities. Formatted as Markdown.'),
});
export type GenerateSchemeOfWorkOutput = z.infer<typeof GenerateSchemeOfWorkOutputSchema>;

export async function generateSchemeOfWork(input: GenerateSchemeOfWorkInput): Promise<GenerateSchemeOfWorkOutput> {
  return generateSchemeOfWorkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSchemeOfWorkPrompt',
  input: {schema: GenerateSchemeOfWorkInputSchema},
  output: {schema: GenerateSchemeOfWorkOutputSchema},
  prompt: `You are an experienced head of department. Create a detailed scheme of work for the specified subject and grade level.

  The scheme should be broken down week-by-week for the entire term duration. For each week, include the main topic, key learning objectives, and suggested teaching and assessment activities. Format the output as clean Markdown.

  Subject: {{{subject}}}
  Grade Level: {{{gradeLevel}}}
  Term Duration: {{{termDuration}}}

  Generate the scheme of work now.`,
});

const generateSchemeOfWorkFlow = ai.defineFlow(
  {
    name: 'generateSchemeOfWorkFlow',
    inputSchema: GenerateSchemeOfWorkInputSchema,
    outputSchema: GenerateSchemeOfWorkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

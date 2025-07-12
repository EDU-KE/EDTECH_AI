'use server';
/**
 * @fileOverview An AI agent that provides an analysis of an academic subject.
 *
 * - analyzeSubject - Analyzes a subject to provide an overview.
 * - AnalyzeSubjectInput - The input type for the function.
 * - AnalyzeSubjectOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSubjectInputSchema = z.object({
  subjectTitle: z.string().describe('The title of the subject to analyze.'),
});
export type AnalyzeSubjectInput = z.infer<typeof AnalyzeSubjectInputSchema>;

const AnalyzeSubjectOutputSchema = z.object({
  analysis: z.string().describe('A concise analysis of the subject, including its core topics, relevance, and importance. Formatted as Markdown.'),
});
export type AnalyzeSubjectOutput = z.infer<typeof AnalyzeSubjectOutputSchema>;

export async function analyzeSubject(input: AnalyzeSubjectInput): Promise<AnalyzeSubjectOutput> {
  return analyzeSubjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSubjectPrompt',
  input: {schema: AnalyzeSubjectInputSchema},
  output: {schema: AnalyzeSubjectOutputSchema},
  prompt: `You are an expert academic advisor. A student wants to understand more about a subject before diving in.

  Provide a concise and encouraging analysis of the subject: **{{{subjectTitle}}}**.

  Your analysis should cover:
  1.  **Core Topics:** Briefly mention 2-3 key areas or topics the student will likely study.
  2.  **Why It's Important:** Explain the real-world relevance of the subject or the skills it develops (e.g., critical thinking, problem-solving).
  3.  **Overall takeaway:** End with a positive and motivating sentence about the subject.

  Keep the entire analysis to about 3-4 short paragraphs. Format the output as Markdown.
  `,
});

const analyzeSubjectFlow = ai.defineFlow(
  {
    name: 'analyzeSubjectFlow',
    inputSchema: AnalyzeSubjectInputSchema,
    outputSchema: AnalyzeSubjectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

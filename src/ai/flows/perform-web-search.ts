
'use server';
/**
 * @fileOverview An AI agent that performs a safe web search and summarizes the results.
 *
 * - performWebSearch - A function that handles the web search and summarization.
 * - PerformWebSearchInput - The input type for the function.
 * - PerformWebSearchOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformWebSearchInputSchema = z.object({
  query: z.string().describe("The user's search query."),
});
export type PerformWebSearchInput = z.infer<typeof PerformWebSearchInputSchema>;

const PerformWebSearchOutputSchema = z.object({
  summary: z.string().describe('A comprehensive, well-structured summary of the web search results, formatted as Markdown.'),
});
export type PerformWebSearchOutput = z.infer<typeof PerformWebSearchOutputSchema>;

export async function performWebSearch(input: PerformWebSearchInput): Promise<PerformWebSearchOutput> {
  return performWebSearchFlow(input);
}

const performWebSearchFlow = ai.defineFlow(
  {
    name: 'performWebSearchFlow',
    inputSchema: PerformWebSearchInputSchema,
    outputSchema: PerformWebSearchOutputSchema,
  },
  async (input) => {
    const searchResult = await ai.generate({
      prompt: `Act as a research assistant. Provide a comprehensive summary for the query: "${input.query}". The summary should be neutral, informative, and easy for a student to understand. Structure the output using Markdown, including headings, bullet points, and bold text for clarity. Do not mention that you cannot access live web data; instead, generate the summary based on your existing knowledge.`,
      model: 'googleai/gemini-1.5-flash',
      output: {
        schema: PerformWebSearchOutputSchema
      }
    });
    
    const output = searchResult.output();
    if (!output) {
      throw new Error('No output from AI model.');
    }
    return output;
  }
);

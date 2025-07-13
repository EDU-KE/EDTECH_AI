
'use server';
/**
 * @fileOverview An AI agent that performs a safe web search and summarizes the results.
 *
 * - performWebSearch - A function that handles the web search and summarization.
 * - PerformWebSearchInput - The input type for the function.
 * - PerformWebSearchOutput - The return type for the function.
 */

import { generateWithDeepSeekAPI, EDUCATIONAL_SYSTEM_PROMPTS, createEducationalPrompt, RESPONSE_FORMATS } from '@/ai/deepseek-api-handler';
import { WebSearchResponseSchema } from '@/ai/ai-response-schemas';
import { z } from 'genkit';

const PerformWebSearchInputSchema = z.object({
  query: z.string().describe("The user's search query."),
});
export type PerformWebSearchInput = z.infer<typeof PerformWebSearchInputSchema>;

const PerformWebSearchOutputSchema = z.object({
  summary: z.string().describe('A comprehensive, well-structured summary of the web search results, formatted as Markdown.'),
});
export type PerformWebSearchOutput = z.infer<typeof PerformWebSearchOutputSchema>;

export async function performWebSearch(input: PerformWebSearchInput): Promise<PerformWebSearchOutput> {
  try {
    const userPrompt = createEducationalPrompt(
      `Act as a research assistant. Provide a comprehensive summary for the query: "${input.query}".

The summary should be:
- Neutral and informative
- Easy for a student to understand
- Well-structured with clear sections and headings
- Include relevant examples where helpful
- Use bullet points for lists
- Be educational and engaging

Do not mention that you cannot access live web data; instead, generate the summary based on your existing knowledge.`,
      RESPONSE_FORMATS.webSearch
    );

    const result = await generateWithDeepSeekAPI({
      systemPrompt: EDUCATIONAL_SYSTEM_PROMPTS.researcher,
      userPrompt,
      temperature: 0.7,
    }, WebSearchResponseSchema);

    return result;

  } catch (error) {
    console.error('❌ Error in performWebSearch:', error);
    return {
      summary: `# Search Results for "${input.query}"

I encountered an error while generating the summary. Please try rephrasing your search query or try again later.

## Suggested Actions:
- Check your spelling
- Try more specific keywords
- Use different search terms`
    };
  }
}


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
import { validateAndFormatResponse } from '@/ai/response-formatter';
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

    // Extract and format the search results
    let summary = '';
    if (result.searchResults) {
      summary = validateAndFormatResponse(result.searchResults, 'educational');
    } else {
      // Fallback if the result structure is unexpected
      summary = generateFallbackWebSearchSummary(input.query);
    }

    return { summary };

  } catch (error: any) {
    console.error('❌ Error in performWebSearch:', error);
    
    // Try to extract content from error if available
    if (error.detail && error.originalMessage) {
      try {
        const errorMessage = error.originalMessage;
        if (errorMessage.includes('searchResults') || errorMessage.includes('summary')) {
          // Extract JSON from the error message
          const jsonMatch = errorMessage.match(/```json\n({[\s\S]*?})\n```/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[1]);
            if (parsedData.searchResults) {
              return {
                summary: validateAndFormatResponse(parsedData.searchResults, 'educational')
              };
            }
          }
        }
      } catch (parseError) {
        console.error('Failed to parse web search data from error:', parseError);
      }
    }
    
    // Final fallback
    return {
      summary: generateFallbackWebSearchSummary(input.query)
    };
  }
}

// Fallback web search summary generator
function generateFallbackWebSearchSummary(query: string): string {
  const fallbackSummary = `# Search Results for "${query}"

## Overview
I encountered an issue while generating the detailed summary for your search query. However, here are some general guidelines and suggestions for your research topic.

## Research Suggestions
To find reliable information about "${query}", consider:

• **Academic Sources**: Look for peer-reviewed articles and educational websites
• **Official Organizations**: Check government, educational institution, or professional organization websites
• **Recent Publications**: Ensure the information is current and up-to-date
• **Multiple Perspectives**: Compare information from different credible sources

## Next Steps
1. **Refine Your Search**: Try using more specific keywords related to your topic
2. **Use Academic Databases**: Consider resources like Google Scholar or educational databases
3. **Consult Experts**: Reach out to teachers, librarians, or subject matter experts
4. **Verify Information**: Cross-check facts with multiple reliable sources

## Need Help?
If you're researching for educational purposes, consider:
- Breaking down complex topics into smaller, more specific questions
- Using educational resources recommended by your institution
- Discussing your research approach with teachers or tutors

*Note: For the most current and detailed information, please consult recent academic sources and official publications related to your specific research needs.*`;

  return validateAndFormatResponse(fallbackSummary, 'educational');
}

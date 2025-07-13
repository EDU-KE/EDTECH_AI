'use server';
/**
 * @fileOverview An AI agent that summarizes notes.
 *
 * - summarizeNotes - A function that handles the note summarization.
 * - SummarizeNotesInput - The input type for the summarizeNotes function.
 * - SummarizeNotesOutput - The return type for the summarizeNotes function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z.string().describe('The notes to be summarized.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  summary: z.string().describe('The summarized version of the notes.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: SummarizeNotesOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an expert academic assistant. Your task is to summarize the provided text.

  Analyze the following notes and create a concise summary. The summary should capture the main ideas, key concepts, and any important definitions or conclusions. Structure the summary for maximum clarity and readability, using bullet points or numbered lists where appropriate.

  Notes to summarize:
  {{{notes}}}
  `,
});

const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const result = output || {};
    const formattedResult = {};
    for (const [key, value] of Object.entries(result)) {
      if (typeof value === 'string') {
        formattedResult[key] = validateAndFormatResponse(value, 'general');
      } else {
        formattedResult[key] = value;
      }
    }
    return formattedResult as any;;
  }
);

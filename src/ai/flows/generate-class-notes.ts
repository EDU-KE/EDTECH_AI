
'use server';
/**
 * @fileOverview An AI agent that generates class notes for a given topic.
 *
 * - generateClassNotes - A function that handles the note generation.
 * - GenerateClassNotesInput - The input type for the function.
 * - GenerateClassNotesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const GenerateClassNotesInputSchema = z.object({
  subject: z.string().describe('The subject of the notes.'),
  topic: z.string().describe('The topic for which to generate notes.'),
  bookContent: z.string().optional().describe('Optional content from a book to use as the primary source for the notes.'),
});
export type GenerateClassNotesInput = z.infer<typeof GenerateClassNotesInputSchema>;

const GenerateClassNotesOutputSchema = z.object({
  notes: z.string().describe('Well-structured and comprehensive class notes on the given topic, formatted as Markdown.'),
});
export type GenerateClassNotesOutput = z.infer<typeof GenerateClassNotesOutputSchema>;

export async function generateClassNotes(input: GenerateClassNotesInput): Promise<GenerateClassNotesOutput> {
  return generateClassNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateClassNotesPrompt',
  input: {schema: GenerateClassNotesInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: GenerateClassNotesOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an expert teacher and academic writer. Your task is to generate comprehensive and easy-to-understand class notes for a specific topic.

  Subject: {{{subject}}}
  Topic: {{{topic}}}

  {{#if bookContent}}
  Use the following book content as the primary source for generating the notes. Create detailed notes that summarize the key concepts, definitions, examples, and important points from the provided text.
  ---
  Book Content:
  {{{bookContent}}}
  ---
  {{else}}
  Create detailed notes that cover the key concepts, definitions, examples, and important points related to the topic.
  {{/if}}

  Structure the final output for clarity using headings, subheadings, and bullet points. The output must be in Markdown format.
  `,
});

const generateClassNotesFlow = ai.defineFlow(
  {
    name: 'generateClassNotesFlow',
    inputSchema: GenerateClassNotesInputSchema,
    outputSchema: GenerateClassNotesOutputSchema,
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

'use server';
/**
 * @fileOverview Generates a study guide for a given book.
 *
 * - generateStudyGuide - A function that generates the study guide.
 * - GenerateStudyGuideInput - The input type for the function.
 * - GenerateStudyGuideOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const GenerateStudyGuideInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  content: z.string().describe('A preview of the content from the book.'),
});
export type GenerateStudyGuideInput = z.infer<typeof GenerateStudyGuideInputSchema>;

const ResourceSchema = z.object({
    type: z.string().describe('Type of the resource, e.g., "Article", "Video", "Interactive Tutorial".'),
    title: z.string().describe('The title of the resource.'),
    url: z.string().url().describe('A URL to the resource.'),
    description: z.string().describe('A brief description of why this resource is recommended.'),
});

const GenerateStudyGuideOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided book content.'),
  keyTopics: z.array(z.string()).describe('A list of 3-5 key topics or concepts covered in the book.'),
  recommendedResources: z.array(ResourceSchema).describe('A list of 2-3 external resources to supplement learning.'),
});
export type GenerateStudyGuideOutput = z.infer<typeof GenerateStudyGuideOutputSchema>;

export async function generateStudyGuide(input: GenerateStudyGuideInput): Promise<GenerateStudyGuideOutput> {
  return generateStudyGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyGuidePrompt',
  input: {schema: GenerateStudyGuideInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: GenerateStudyGuideOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an AI learning assistant. Your task is to create a study guide for a student based on a book's title and a preview of its content.

  The study guide should contain three parts:
  1.  **Summary:** A brief summary of the provided book content.
  2.  **Key Topics:** Identify 3-5 main topics or key concepts that the student should focus on based on the text.
  3.  **Recommended Resources:** Suggest 2-3 high-quality, external learning resources (like articles or videos) that are relevant to the book's main themes. Provide a title, URL, type, and brief description for each.

  Book Title: {{{title}}}

  Book Content Preview:
  ---
  {{{content}}}
  ---

  Generate the study guide now.
  `,
});

const generateStudyGuideFlow = ai.defineFlow(
  {
    name: 'generateStudyGuideFlow',
    inputSchema: GenerateStudyGuideInputSchema,
    outputSchema: GenerateStudyGuideOutputSchema,
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

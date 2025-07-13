
'use server';
/**
 * @fileOverview An AI agent that generates a presentation from book content.
 *
 * - generatePresentation - Creates presentation slides and questions.
 * - GeneratePresentationInput - The input type for the function.
 * - GeneratePresentationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

function generateIsoId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = 'CLS-';
  for (let i = 0; i < 2; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
}


const GeneratePresentationInputSchema = z.object({
  subject: z.string().describe('The subject of the presentation.'),
  topic: z.string().describe('The specific topic of the presentation.'),
  bookContent: z.string().describe('A content preview from a book to use as the source material.'),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
    title: z.string().describe("A concise title for the slide."),
    content: z.array(z.string()).describe("A list of key points or sentences for the slide body. Each string is a bullet point."),
});

const QuestionSchema = z.object({
    questionText: z.string().describe("The text of the question."),
    answer: z.string().describe("The correct answer to the question."),
});

const GeneratePresentationOutputSchema = z.object({
  isoId: z.string().describe("A unique ISO-style ID for the session."),
  title: z.string().describe("An overall title for the presentation."),
  slides: z.array(SlideSchema).min(3).max(7).describe("An array of 3 to 7 presentation slides."),
  questions: z.array(QuestionSchema).min(3).max(5).describe("An array of 3 to 5 questions based on the presentation content."),
});
export type GeneratePresentationOutput = z.infer<typeof GeneratePresentationOutputSchema>;

export async function generatePresentation(input: GeneratePresentationInput): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePresentationPrompt',
  input: {schema: GeneratePresentationInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: GeneratePresentationOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an expert instructional designer. Your task is to create a classroom presentation based on a given topic and content from a book.

  **Subject:** {{{subject}}}
  **Topic:** {{{topic}}}

  **Source Content:**
  ---
  {{{bookContent}}}
  ---

  **Instructions:**
  1.  **Create a Presentation Title:** Generate a clear and engaging title for the presentation based on the topic.
  2.  **Generate Slides:** Create a sequence of 3 to 7 slides. Each slide must have a title and a list of 2-4 key bullet points that are easy to understand for a classroom setting. The slides should logically flow and cover the main ideas from the source content.
  3.  **Generate Questions:** Based on the content of the slides, create a list of 3 to 5 questions to test the students' understanding. Provide a correct answer for each question.
  4.  **Generate ISO ID:** Create a unique session ID with the format 'CLS-XX0000'.
  
  Structure the entire output according to the provided JSON schema.
  `,
});

const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: GeneratePresentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate presentation content.");
    }
    // Ensure ISO ID is generated if model fails to do so
    if (!output.isoId || !output.isoId.startsWith('CLS-')) {
        output.isoId = generateIsoId();
    }
    return output;
  }
);

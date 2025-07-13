'use server';
/**
 * @fileOverview An AI agent that provides advice on a student's diary or plan.
 *
 * - generateDiaryAdvice - Analyzes a diary entry to provide suggestions.
 * - GenerateDiaryAdviceInput - The input type for the function.
 * - GenerateDiaryAdviceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const GenerateDiaryAdviceInputSchema = z.object({
  plan: z.string().describe("The student's diary entry or plan for the day/week."),
});
export type GenerateDiaryAdviceInput = z.infer<typeof GenerateDiaryAdviceInputSchema>;

const GenerateDiaryAdviceOutputSchema = z.object({
  advice: z.string().describe("Concise, actionable advice to help the student improve their plan. Formatted as Markdown."),
});
export type GenerateDiaryAdviceOutput = z.infer<typeof GenerateDiaryAdviceOutputSchema>;

export async function generateDiaryAdvice(input: GenerateDiaryAdviceInput): Promise<GenerateDiaryAdviceOutput> {
  return generateDiaryAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDiaryAdvicePrompt',
  input: {schema: GenerateDiaryAdviceInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: GenerateDiaryAdviceOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an encouraging and effective AI academic coach. Your goal is to help a student refine their plans to be more specific, actionable, and manageable.

  Analyze the student's plan below. Provide one or two brief, constructive suggestions.

  - If the plan is vague (e.g., "study for exam"), suggest breaking it down into smaller, concrete tasks (e.g., "review chapters 1-3," "do 10 practice problems").
  - If the plan seems overwhelming, suggest prioritizing or scheduling specific blocks of time.
  - If the student mentions a specific subject, you can offer a relevant study tip.
  - Always maintain a positive and encouraging tone. Start with a phrase like "That's a great start!" or "Excellent plan!".

  Student's Plan:
  ---
  {{{plan}}}
  ---

  Generate your advice now. Keep it short and to the point.
  `,
});

const generateDiaryAdviceFlow = ai.defineFlow(
  {
    name: 'generateDiaryAdviceFlow',
    inputSchema: GenerateDiaryAdviceInputSchema,
    outputSchema: GenerateDiaryAdviceOutputSchema,
  },
  async input => {
    // If the plan is too short, don't run the AI.
    if (input.plan.trim().length < 15) {
        return { advice: "Keep typing your plan, and I'll offer suggestions!" };
    }
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

'use server';
/**
 * @fileOverview An AI agent that analyzes a student's activity log.
 *
 * - analyzeStudentActivity - Analyzes the activity log to provide insights.
 * - AnalyzeStudentActivityInput - The input type for the function.
 * - AnalyzeStudentActivityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const ActivitySchema = z.object({
  description: z.string(),
  timestamp: z.string(),
  subject: z.string(),
});

const AnalyzeStudentActivityInputSchema = z.object({
  activities: z.array(ActivitySchema).describe("A list of the student's recent activities."),
});
export type AnalyzeStudentActivityInput = z.infer<typeof AnalyzeStudentActivityInputSchema>;

const AnalyzeStudentActivityOutputSchema = z.object({
  analysis: z.string().describe("A concise analysis of the student's learning patterns, engagement, and suggestions for improvement. Formatted as Markdown."),
});
export type AnalyzeStudentActivityOutput = z.infer<typeof AnalyzeStudentActivityOutputSchema>;

export async function analyzeStudentActivity(input: AnalyzeStudentActivityInput): Promise<AnalyzeStudentActivityOutput> {
  return analyzeStudentActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentActivityPrompt',
  input: {schema: AnalyzeStudentActivityInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: AnalyzeStudentActivityOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an AI academic coach. Your role is to analyze a student's activity log to identify learning patterns and provide constructive feedback. The goal is to determine if the student is actively and effectively learning.

  Analyze the following activity log:
  {{#each activities}}
  - **{{timestamp}}**: {{description}} ({{subject}})
  {{/each}}

  Based on this log, provide a brief analysis covering:
  1.  **Engagement Level:** Is the student consistently active or are there long gaps?
  2.  **Subject Focus:** Is the activity balanced across subjects or focused on one area?
  3.  **Learning Habits:** What kind of activities are most common (e.g., watching videos, taking quizzes, using AI tools)?
  4.  **Actionable Suggestion:** Provide one specific, encouraging suggestion to help the student learn more effectively. For example, "Your engagement in Science is great! Try using the AI question generator to test your knowledge on 'Chemical Bonds' before your next quiz."

  Keep the analysis concise and positive. Format the output as Markdown.
  `,
});

const analyzeStudentActivityFlow = ai.defineFlow(
  {
    name: 'analyzeStudentActivityFlow',
    inputSchema: AnalyzeStudentActivityInputSchema,
    outputSchema: AnalyzeStudentActivityOutputSchema,
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

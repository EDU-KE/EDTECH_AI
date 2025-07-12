
'use server';
/**
 * @fileOverview An AI agent that grades an exam.
 *
 * - gradeExam - A function that handles the exam grading process.
 * - GradeExamInput - The input type for the function.
 * - GradeExamOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GradeExamInputSchema = z.object({
  subject: z.string().describe('The subject of the exam.'),
  examTitle: z.string().describe('The title of the exam to be graded.'),
});
export type GradeExamInput = z.infer<typeof GradeExamInputSchema>;

const GradeExamOutputSchema = z.object({
  score: z.number().int().min(0).max(100).describe('The final percentage score for the exam.'),
  feedback: z.string().describe("Comprehensive feedback on the student's performance, highlighting strengths and areas for improvement. Formatted as Markdown."),
  answerKey: z.string().describe("A concise answer key for the exam questions. Formatted as Markdown."),
});
export type GradeExamOutput = z.infer<typeof GradeExamOutputSchema>;

export async function gradeExam(input: GradeExamInput): Promise<GradeExamOutput> {
  return gradeExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradeExamPrompt',
  input: {schema: GradeExamInputSchema},
  output: {schema: GradeExamOutputSchema},
  prompt: `You are an AI examiner. Your task is to grade a student's performance on a mock exam and provide comprehensive feedback.

  The exam is for the subject '{{{subject}}}' and is titled '{{{examTitle}}}'.

  Assume the student has just completed the exam. Your task is to generate a realistic but constructive assessment.
  
  1.  **Generate a Score:** Create a plausible percentage score for the student. Do not always make it high; a range between 60 and 95 is realistic.
  2.  **Provide Feedback:** Write a few paragraphs of feedback.
      - Start by acknowledging their effort.
      - Mention 1-2 topics or areas where the student performed well.
      - Identify 1-2 specific areas where they could improve.
      - Offer a concrete suggestion for how to improve (e.g., "To improve on the 'Algebra' section, try re-watching the video on linear equations and completing the practice questions in the library.").
  3.  **Create an Answer Key:** Provide a concise answer key for about 5-7 key questions that would likely be on this exam. Format it clearly using Markdown.

  Generate the response now.`,
});

const gradeExamFlow = ai.defineFlow(
  {
    name: 'gradeExamFlow',
    inputSchema: GradeExamInputSchema,
    outputSchema: GradeExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

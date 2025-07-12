'use server';
/**
 * @fileOverview Explains an exam based on its title and subject.
 *
 * - explainExam - A function that handles exam explanation.
 * - ExplainExamInput - The input type for the function.
 * - ExplainExamOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainExamInputSchema = z.object({
  subject: z.string().describe('The subject of the exam.'),
  examTitle: z.string().describe('The title of the exam.'),
});
export type ExplainExamInput = z.infer<typeof ExplainExamInputSchema>;

const ExplainExamOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the exam, including likely topics, question formats, and study tips. Formatted as Markdown.'),
});
export type ExplainExamOutput = z.infer<typeof ExplainExamOutputSchema>;

export async function explainExam(input: ExplainExamInput): Promise<ExplainExamOutput> {
  return explainExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainExamPrompt',
  input: {schema: ExplainExamInputSchema},
  output: {schema: ExplainExamOutputSchema},
  prompt: `You are an AI academic advisor. A student has an upcoming exam and needs help understanding it. Based on the exam's title and subject, provide a helpful explanation.

  Your explanation should cover:
  1.  **Likely Topics:** What specific topics might be on the exam.
  2.  **Potential Question Formats:** What types of questions (e.g., multiple choice, essay) to expect.
  3.  **Key Concepts to Review:** Important concepts the student should focus on.
  4.  **Study Tips:** Actionable advice for preparing for this specific exam.

  Format your response in clear, easy-to-read Markdown.

  Subject: {{{subject}}}
  Exam Title: {{{examTitle}}}

  Generate the explanation now.
  `,
});

const explainExamFlow = ai.defineFlow(
  {
    name: 'explainExamFlow',
    inputSchema: ExplainExamInputSchema,
    outputSchema: ExplainExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


'use server';

/**
 * @fileOverview An AI tutoring agent that answers questions about any subject.
 *
 * - provideAiTutoring - A function that handles the AI tutoring process.
 * - ProvideAiTutoringInput - The input type for the provideAiTutoring function.
 * - ProvideAiTutoringOutput - The return type for the provideAiTutoring function.
 */

import {ai} from '@/ai/genkit';
import {getExamsBySubject} from '@/lib/mock-data';
import {z} from 'genkit';

const ExamSchema = z.object({
    title: z.string(),
    topic: z.string(),
    duration: z.string(),
});

const ProvideAiTutoringInputSchema = z.object({
  subject: z.string().describe('The subject of the question.'),
  question: z.string().describe('The question to ask the AI tutor.'),
  upcomingExams: z.array(ExamSchema).optional().describe('A list of upcoming exams for the subject to provide context.'),
});
export type ProvideAiTutoringInput = z.infer<typeof ProvideAiTutoringInputSchema>;

const ProvideAiTutoringOutputSchema = z.object({
  answer: z.string().describe('The answer to the question from the AI tutor.'),
});
export type ProvideAiTutoringOutput = z.infer<typeof ProvideAiTutoringOutputSchema>;

export async function provideAiTutoring(input: ProvideAiTutoringInput): Promise<ProvideAiTutoringOutput> {
  // In a real app, this data might be fetched dynamically.
  // By passing it into the flow, we avoid making the AI use a tool for static context.
  const exams = getExamsBySubject(input.subject);
  return provideAiTutoringFlow({ ...input, upcomingExams: exams });
}

const prompt = ai.definePrompt({
  name: 'provideAiTutoringPrompt',
  input: {schema: ProvideAiTutoringInputSchema},
  output: {schema: ProvideAiTutoringOutputSchema},
  system: `You are an AI tutor specializing in {{{subject}}}.
If the user's question relates to upcoming tests or exams, use the context provided about upcoming exams to inform your answer.
Do not tell the user you were provided with a list of exams; just use the information naturally in your response if relevant.`,
  prompt: `A student has asked the following question:
"{{question}}"

{{#if upcomingExams.length}}
For your context, here is a list of upcoming exams for this subject. You may use this to answer questions about tests.
Upcoming Exams:
{{#each upcomingExams}}
- {{title}} (Topic: {{topic}}, Duration: {{duration}})
{{/each}}
{{/if}}

Provide a helpful and clear explanation to the student.`,
});

const provideAiTutoringFlow = ai.defineFlow(
  {
    name: 'provideAiTutoringFlow',
    inputSchema: ProvideAiTutoringInputSchema,
    outputSchema: ProvideAiTutoringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

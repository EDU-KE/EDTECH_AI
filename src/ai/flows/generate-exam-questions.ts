'use server';
/**
 * @fileOverview Generates exam questions for a given subject and topic.
 *
 * - generateExamQuestions - A function that handles question generation.
 * - GenerateExamQuestionsInput - The input type for the function.
 * - GenerateExamQuestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExamQuestionsInputSchema = z.object({
  subject: z.string().describe('The subject of the exam.'),
  topic: z.string().describe('The topic for which to generate questions.'),
  numQuestions: z.number().int().min(1).max(20).describe('The number of questions to generate.'),
  questionTypes: z.array(z.string()).describe('The types of questions to generate (e.g., "Multiple Choice", "Short Answer").'),
});
export type GenerateExamQuestionsInput = z.infer<typeof GenerateExamQuestionsInputSchema>;

const QuestionSchema = z.object({
    questionText: z.string().describe("The text of the question."),
    questionType: z.string().describe("The type of question (e.g., 'Multiple Choice', 'Short Answer')."),
    options: z.array(z.string()).optional().describe("A list of options for multiple-choice questions."),
    answer: z.string().describe("The correct answer to the question."),
});

const GenerateExamQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('A list of generated exam questions.'),
});
export type GenerateExamQuestionsOutput = z.infer<typeof GenerateExamQuestionsOutputSchema>;

export async function generateExamQuestions(input: GenerateExamQuestionsInput): Promise<GenerateExamQuestionsOutput> {
  return generateExamQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExamQuestionsPrompt',
  input: {schema: GenerateExamQuestionsInputSchema},
  output: {schema: GenerateExamQuestionsOutputSchema},
  prompt: `You are an expert educator and exam creator. Your task is to generate a set of exam questions based on the provided criteria.

  Subject: {{{subject}}}
  Topic: {{{topic}}}
  Number of Questions: {{{numQuestions}}}
  Question Types: {{#each questionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Please generate the specified number of questions of the requested types. For multiple-choice questions, provide 4 distinct options and indicate the correct answer. For short answer questions, provide a concise and accurate answer.
  `,
});

const generateExamQuestionsFlow = ai.defineFlow(
  {
    name: 'generateExamQuestionsFlow',
    inputSchema: GenerateExamQuestionsInputSchema,
    outputSchema: GenerateExamQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

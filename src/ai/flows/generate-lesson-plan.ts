'use server';
/**
 * @fileOverview Generates a lesson plan for a given subject and topic.
 *
 * - generateLessonPlan - A function that generates the lesson plan.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  subject: z.string().describe('The subject of the lesson (e.g., Biology).'),
  topic: z.string().describe('The specific topic for the lesson (e.g., Cell Structure).'),
  duration: z.string().describe('The duration of the lesson in minutes (e.g., 45 minutes).'),
  objectives: z.string().describe('The learning objectives for the lesson.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('A detailed lesson plan, including activities, materials, and assessment methods. Formatted as Markdown.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert curriculum developer. Create a detailed lesson plan based on the following information.

  The lesson plan should be well-structured, engaging, and suitable for the specified duration. Include introduction, activities, necessary materials, and a method for assessment. Format the output as clean Markdown.

  Subject: {{{subject}}}
  Topic: {{{topic}}}
  Lesson Duration: {{{duration}}}
  Learning Objectives:
  {{{objectives}}}

  Generate the lesson plan now.`,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

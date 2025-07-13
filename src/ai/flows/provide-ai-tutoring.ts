
'use server';

/**
 * @fileOverview An AI tutoring agent that answers questions about any subject.
 *
 * - provideAiTutoring - A function that handles the AI tutoring process.
 * - ProvideAiTutoringInput - The input type for the provideAiTutoring function.
 * - ProvideAiTutoringOutput - The return type for the provideAiTutoring function.
 */

import { generateWithDeepSeekAPI, EDUCATIONAL_SYSTEM_PROMPTS, createEducationalPrompt, RESPONSE_FORMATS } from '@/ai/deepseek-api-handler';
import { TutoringResponseSchema } from '@/ai/ai-response-schemas';
import { getExamsBySubject } from '@/lib/mock-data';
import { z } from 'genkit';

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
  // Get exam context for the subject
  const exams = getExamsBySubject(input.subject);
  
  try {
    const examsContext = exams && exams.length > 0 
      ? `\n\nFor context, here are upcoming exams:\n${exams.map(exam => `- ${exam.title} (Topic: ${exam.topic}, Duration: ${exam.duration})`).join('\n')}\n`
      : '';

    const userPrompt = createEducationalPrompt(
      `A student studying ${input.subject} has asked: "${input.question}"${examsContext}

Provide a helpful and clear explanation to the student. Be supportive, educational, and adapt your response to their level.`,
      RESPONSE_FORMATS.tutoring
    );

    const result = await generateWithDeepSeekAPI({
      systemPrompt: EDUCATIONAL_SYSTEM_PROMPTS.tutor,
      userPrompt,
      temperature: 0.7,
    }, TutoringResponseSchema);

    return result;

  } catch (error) {
    console.error('❌ Error in provideAiTutoring:', error);
    return {
      answer: "I'm sorry, I encountered an error while processing your question. Please try again."
    };
  }
}

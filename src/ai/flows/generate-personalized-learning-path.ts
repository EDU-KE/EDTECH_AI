'use server';
/**
 * @fileOverview Generates a personalized learning path for a given subject based on the student's knowledge level and learning goals.
 *
 * - generatePersonalizedLearningPath - A function that generates the learning path.
 * - GeneratePersonalizedLearningPathInput - The input type for the generatePersonalizedLearningPath function.
 * - GeneratePersonalizedLearningPathOutput - The return type for the generatePersonalizedLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const GeneratePersonalizedLearningPathInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate a learning path (e.g., Math, Science, History).'),
  knowledgeLevel: z.string().describe('The student\'s current knowledge level (e.g., Beginner, Intermediate, Advanced).'),
  learningGoals: z.string().describe('The student\'s learning goals for the subject (e.g., Pass the AP exam, Get a good grade in class, Learn the basics).'),
});
export type GeneratePersonalizedLearningPathInput = z.infer<typeof GeneratePersonalizedLearningPathInputSchema>;

const GeneratePersonalizedLearningPathOutputSchema = z.object({
  learningPath: z.string().describe('A personalized learning path for the subject, including topics to study and resources to use.'),
});
export type GeneratePersonalizedLearningPathOutput = z.infer<typeof GeneratePersonalizedLearningPathOutputSchema>;

export async function generatePersonalizedLearningPath(input: GeneratePersonalizedLearningPathInput): Promise<GeneratePersonalizedLearningPathOutput> {
  return generatePersonalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedLearningPathPrompt',
  input: {schema: GeneratePersonalizedLearningPathInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: GeneratePersonalizedLearningPathOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an expert in creating personalized learning paths for students.

  Based on the student's current knowledge level, learning goals, and the subject they want to study, create a personalized learning path for them.

  Subject: {{{subject}}}
  Knowledge Level: {{{knowledgeLevel}}}
  Learning Goals: {{{learningGoals}}}

  Learning Path:`,
});

const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
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

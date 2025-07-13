'use server';
/**
 * @fileOverview Generates a lesson plan for a given subject and topic.
 *
 * - generateLessonPlan - A function that generates the lesson plan.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import { generateWithDeepSeekAPI, EDUCATIONAL_SYSTEM_PROMPTS, createEducationalPrompt, RESPONSE_FORMATS } from '@/ai/deepseek-api-handler';
import { LessonPlanResponseSchema } from '@/ai/ai-response-schemas';
import { z } from 'genkit';

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
  try {
    const userPrompt = createEducationalPrompt(
      `Create a detailed lesson plan based on the following information:

Subject: ${input.subject}
Topic: ${input.topic}
Lesson Duration: ${input.duration}
Learning Objectives: ${input.objectives}

The lesson plan should be well-structured, engaging, and suitable for the specified duration. Include:
- Clear introduction
- Main activities with timing
- Necessary materials
- Assessment methods
- Conclusion/wrap-up

Format the content with proper Markdown structure for easy reading.`,
      RESPONSE_FORMATS.lessonPlan
    );

    const result = await generateWithDeepSeekAPI({
      systemPrompt: EDUCATIONAL_SYSTEM_PROMPTS.lessonPlanner,
      userPrompt,
      temperature: 0.7,
    }, LessonPlanResponseSchema);

    return result;

  } catch (error) {
    console.error('❌ Error in generateLessonPlan:', error);
    return {
      lessonPlan: `# Lesson Plan: ${input.topic}

## Subject: ${input.subject}
## Duration: ${input.duration}

### Learning Objectives
${input.objectives}

### Materials
- Whiteboard/flipchart
- Handouts (to be prepared)
- Writing materials

### Lesson Structure
1. **Introduction** (5 minutes) - Overview of the topic
2. **Main Activity** (Most of lesson time) - Interactive learning
3. **Assessment** (5-10 minutes) - Check understanding
4. **Conclusion** (5 minutes) - Summary and next steps

*Note: Detailed lesson plan generation encountered an error. Please try again for a more comprehensive plan.*`
    };
  }
}

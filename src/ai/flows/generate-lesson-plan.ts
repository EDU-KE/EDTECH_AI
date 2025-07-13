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
import { parseJsonFromLLM } from '@/ai/parseJsonFromLLM';
import { validateAndFormatResponse } from '@/ai/response-formatter';
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

    // Extract the lesson plan content
    let lessonPlanContent = '';
    const typedResult = result as any;
    
    try {
      if (typedResult && typeof typedResult === 'object') {
        if (typedResult.lessonPlan) {
          lessonPlanContent = String(typedResult.lessonPlan);
        } else if (typeof typedResult === 'string') {
          lessonPlanContent = typedResult;
        } else {
          // Try to parse as JSON if it's a string containing JSON
          const jsonResponse = parseJsonFromLLM(JSON.stringify(typedResult)) as any;
          if (jsonResponse && jsonResponse.lessonPlan) {
            lessonPlanContent = String(jsonResponse.lessonPlan);
          } else {
            lessonPlanContent = String(typedResult);
          }
        }
      } else if (typeof result === 'string') {
        // Try to parse JSON from string
        const jsonResponse = parseJsonFromLLM(result) as any;
        if (jsonResponse && jsonResponse.lessonPlan) {
          lessonPlanContent = String(jsonResponse.lessonPlan);
        } else {
          lessonPlanContent = result;
        }
      }
    } catch (parseError) {
      console.warn('⚠️  Failed to parse lesson plan response, using raw result:', parseError);
      lessonPlanContent = String(result);
    }

    // Apply formatting if we have content
    if (lessonPlanContent) {
      const formattedContent = await validateAndFormatResponse(
        { lessonPlan: lessonPlanContent },
        'educational'
      );
      
      if (typeof formattedContent === 'string') {
        return { lessonPlan: formattedContent };
      } else if (formattedContent && typeof formattedContent === 'object' && 'lessonPlan' in formattedContent) {
        return formattedContent as GenerateLessonPlanOutput;
      }
    }

    // Fallback if content processing fails
    return {
      lessonPlan: lessonPlanContent || `# Lesson Plan: ${input.topic}

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

### Assessment Methods
- Formative assessment through questioning
- Exit ticket or quick quiz
- Observation of student participation

*Note: Basic lesson plan structure generated.*`
    };

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

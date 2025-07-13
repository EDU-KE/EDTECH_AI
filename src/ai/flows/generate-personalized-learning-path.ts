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
import {learningPathContentTransformer} from '@/ai/ai-response-schemas';
import {parseJsonFromLLM} from '@/ai/parseJsonFromLLM';
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
  output: {schema: GeneratePersonalizedLearningPathOutputSchema},
  prompt: `You are an expert educational consultant specializing in creating personalized learning paths for students.

  Create a comprehensive, structured learning path based on the student's profile:

  Subject: {{{subject}}}
  Current Knowledge Level: {{{knowledgeLevel}}}
  Learning Goals: {{{learningGoals}}}

  Generate a detailed learning path that includes:
  1. Learning objectives tailored to their level
  2. Step-by-step progression plan
  3. Recommended resources and materials
  4. Assessment checkpoints
  5. Estimated timeline
  6. Prerequisites (if any)
  7. Tips for success

  Format the response as a well-structured learning path with clear sections and actionable steps.

  Learning Path:`,
});

/**
 * Generate a fallback learning path when AI generation fails
 */
function generateFallbackLearningPath(input: GeneratePersonalizedLearningPathInput): GeneratePersonalizedLearningPathOutput {
  const { subject, knowledgeLevel, learningGoals } = input;
  
  return {
    learningPath: `# Personalized Learning Path for ${subject}

## Student Profile
- **Subject:** ${subject}
- **Current Level:** ${knowledgeLevel}
- **Learning Goals:** ${learningGoals}

## Learning Path Overview

### Phase 1: Foundation Building (Weeks 1-2)
- Review fundamental concepts
- Identify knowledge gaps
- Build confidence with basic exercises

### Phase 2: Core Learning (Weeks 3-6)
- Study main topics systematically
- Practice with guided exercises
- Apply knowledge to real-world examples

### Phase 3: Advanced Application (Weeks 7-8)
- Tackle complex problems
- Work on projects
- Prepare for assessments

## Recommended Study Schedule
- **Daily:** 30-60 minutes of focused study
- **Weekly:** 1-2 hours of practice and review
- **Assessment:** Weekly self-evaluation

## Resources
- Textbooks and online materials
- Practice exercises and quizzes
- Study groups and peer support
- Educational videos and tutorials

## Success Tips
1. Set realistic daily goals
2. Track your progress regularly
3. Ask questions when stuck
4. Practice consistently
5. Review and reinforce learning

*This is a general learning path. Consider consulting with a teacher or tutor for personalized guidance.*`
  };
}

const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      const result = output || {};
      
      // Use proper typing for the formatted result
      const formattedResult: GeneratePersonalizedLearningPathOutput = {
        learningPath: ''
      };
      
      for (const [key, value] of Object.entries(result)) {
        if (key === 'learningPath' && typeof value === 'string') {
          formattedResult.learningPath = validateAndFormatResponse(value, 'learning-path');
        } else if (typeof value === 'string') {
          // Transform the value using the learning path content transformer
          const transformedValue = learningPathContentTransformer.parse(value);
          formattedResult.learningPath = validateAndFormatResponse(transformedValue, 'learning-path');
        }
      }
      
      // Ensure we have content
      if (!formattedResult.learningPath || formattedResult.learningPath.trim().length === 0) {
        console.warn('Empty learning path generated, using fallback');
        return generateFallbackLearningPath(input);
      }
      
      return formattedResult;
      
    } catch (error) {
      console.error('Error generating learning path:', error);
      
      // Try to extract JSON from error message
      if (error instanceof Error && error.message) {
        try {
          const extractedData = parseJsonFromLLM(error.message);
          if (extractedData && typeof extractedData === 'object') {
            const data = extractedData as any;
            const learningPath = data.learningPath || 
                               data.path || 
                               data.curriculum ||
                               JSON.stringify(extractedData);
            
            if (learningPath) {
              const transformedContent = learningPathContentTransformer.parse(learningPath);
              return {
                learningPath: validateAndFormatResponse(transformedContent, 'learning-path')
              };
            }
          }
        } catch (parseError) {
          console.error('Failed to parse JSON from error message:', parseError);
        }
      }
      
      // Final fallback
      console.warn('Using fallback learning path due to AI generation failure');
      return generateFallbackLearningPath(input);
    }
  }
);

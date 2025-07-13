'use server';
/**
 * @fileOverview An AI agent that provides an analysis of an academic subject.
 *
 * - analyzeSubject - Analyzes a subject to provide an overview.
 * - AnalyzeSubjectInput - The input type for the function.
 * - AnalyzeSubjectOutput - The return type for the function.
 */

import { generateWithDeepSeekAPI, EDUCATIONAL_SYSTEM_PROMPTS, createEducationalPrompt, RESPONSE_FORMATS } from '@/ai/deepseek-api-handler';
import { SubjectAnalysisResponseSchema } from '@/ai/ai-response-schemas';
import { z } from 'genkit';

const AnalyzeSubjectInputSchema = z.object({
  subjectTitle: z.string().describe('The title of the subject to analyze.'),
});
export type AnalyzeSubjectInput = z.infer<typeof AnalyzeSubjectInputSchema>;

const AnalyzeSubjectOutputSchema = z.object({
  analysis: z.string().describe('A concise analysis of the subject, including its core topics, relevance, and importance. Formatted as Markdown.'),
});
export type AnalyzeSubjectOutput = z.infer<typeof AnalyzeSubjectOutputSchema>;

export async function analyzeSubject(input: AnalyzeSubjectInput): Promise<AnalyzeSubjectOutput> {
  try {
    const userPrompt = createEducationalPrompt(
      `Analyze the following academic subject and provide an informative overview.

Subject: ${input.subjectTitle}

Provide an analysis that covers:
- What the subject is about and its core topics
- Key skills students develop through studying this subject
- Why this subject is important or valuable
- Any interesting or engaging aspects that might motivate students

Make your analysis engaging and informative for students. Write it as a well-structured educational overview.`,
      `{
  "analysis": "Your comprehensive analysis here as a single well-formatted text with clear sections and bullet points"
}`
    );

    const result = await generateWithDeepSeekAPI({
      systemPrompt: EDUCATIONAL_SYSTEM_PROMPTS.analyst,
      userPrompt,
      temperature: 0.7,
    }, SubjectAnalysisResponseSchema);

    return result;

  } catch (error) {
    console.error('❌ Error in analyzeSubject:', error);
    // Fallback response
    return {
      analysis: `**${input.subjectTitle}** is an important academic subject that offers valuable learning opportunities. This subject helps students develop critical thinking skills and provides knowledge that can be applied in various real-world contexts.`
    };
  }
}

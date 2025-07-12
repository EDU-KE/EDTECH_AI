'use server';
/**
 * @fileOverview An AI agent that recommends a career path based on student performance.
 *
 * - recommendCareerPath - A function that handles the career path recommendation.
 * - RecommendCareerPathInput - The input type for the function.
 * - RecommendCareerPathOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentPerformanceSchema = z.object({
  strongestSubjects: z.array(z.string()).describe("The student's strongest subjects."),
  weakestSubjects: z.array(z.string()).describe("The student's weakest subjects where they might need improvement."),
  interests: z.array(z.string()).describe("The student's personal or academic interests."),
  recentScores: z.record(z.string(), z.number()).describe("A record of recent exam scores, mapping subject to percentage."),
});

export type RecommendCareerPathInput = z.infer<typeof StudentPerformanceSchema>;

const CareerPathSchema = z.object({
    career: z.string().describe("The name of the recommended career (e.g., 'Software Engineer')."),
    field: z.string().describe("The broader field or industry for this career (e.g., 'Technology', 'Healthcare')."),
    reasoning: z.string().describe("A brief explanation of why this career is a good fit for the student based on their profile."),
});

const RecommendCareerPathOutputSchema = z.object({
  recommendedPaths: z.array(CareerPathSchema).length(4).describe('A list of four diverse and suitable career path recommendations.'),
  subjectRecommendations: z.string().describe("Actionable advice on which subjects to focus on, improve, or explore to support the recommended career paths. Formatted as Markdown."),
});
export type RecommendCareerPathOutput = z.infer<typeof RecommendCareerPathOutputSchema>;

export async function recommendCareerPath(input: RecommendCareerPathInput): Promise<RecommendCareerPathOutput> {
  return recommendCareerPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCareerPathPrompt',
  input: {schema: StudentPerformanceSchema},
  output: {schema: RecommendCareerPathOutputSchema},
  prompt: `You are an expert AI career counselor for students. Your task is to analyze a student's academic performance and interests to provide insightful and actionable career guidance.

  **Student Profile:**
  - **Strongest Subjects:** {{#each strongestSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Weakest Subjects:** {{#each weakestSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Interests:** {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Recent Scores:**
    {{#each recentScores}}
    - {{@key}}: {{this}}%
    {{/each}}

  **Your Tasks:**

  1.  **Recommend Career Paths:**
      - Based on the student's profile, identify **four** distinct and suitable career paths.
      - For each path, provide the career title, the general field, and a concise reason why it aligns with the student's strengths and interests.
      - Ensure the recommendations are diverse to give the student options.

  2.  **Provide Subject Recommendations:**
      - Write a brief, encouraging paragraph that gives the student actionable advice on their studies.
      - Recommend which subjects they should continue to excel in.
      - Suggest how they can improve in their weaker subjects and why it's important for their potential career paths.
      - Recommend one or two new subjects or skills they might want to explore (e.g., coding, public speaking, economics) that would complement their profile.

  Generate the response now.
  `,
});

const recommendCareerPathFlow = ai.defineFlow(
  {
    name: 'recommendCareerPathFlow',
    inputSchema: StudentPerformanceSchema,
    outputSchema: RecommendCareerPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI agent that recommends a contest based on a student's profile.
 *
 * - recommendContest - A function that handles the contest recommendation.
 * - RecommendContestInput - The input type for the function.
 * - RecommendContestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const StudentPerformanceSchema = z.object({
  strongestSubjects: z.array(z.string()),
  interests: z.array(z.string()),
  recentScores: z.record(z.string(), z.number()),
});

const ContestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  subject: z.string(),
});

const RecommendContestInputSchema = z.object({
  studentProfile: StudentPerformanceSchema.describe("The student's academic and interest profile."),
  contests: z.array(ContestSchema).describe('A list of available contests.'),
});
export type RecommendContestInput = z.infer<typeof RecommendContestInputSchema>;

const RecommendContestOutputSchema = z.object({
  recommendedContestId: z.string().describe('The ID of the recommended contest.'),
  reasoning: z.string().describe('A personalized explanation for why the contest is a good fit for the student.'),
});
export type RecommendContestOutput = z.infer<typeof RecommendContestOutputSchema>;

export async function recommendContest(input: RecommendContestInput): Promise<RecommendContestOutput> {
  return recommendContestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendContestPrompt',
  input: {schema: RecommendContestInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: RecommendContestOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an encouraging AI academic advisor. Your task is to recommend the best competition for a student based on their profile and the available contests.

  **Student Profile:**
  - **Strongest Subjects:** {{#each studentProfile.strongestSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Interests:** {{#each studentProfile.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Recent Scores:**
    {{#each studentProfile.recentScores}}
    - {{@key}}: {{this}}%
    {{/each}}

  **Available Contests:**
  {{#each contests}}
  - **ID:** {{id}}
    **Title:** {{title}}
    **Description:** {{description}}
    **Related Subject:** {{subject}}
  {{/each}}

  **Instructions:**
  1.  Analyze the student's strongest subjects and interests.
  2.  Compare their profile against the descriptions and subjects of the available contests.
  3.  Select the single best contest for this student.
  4.  Provide a short, encouraging reason for your recommendation, directly addressing the student. Explain why their skills or interests make this particular contest a great choice for them.
  `,
});

const recommendContestFlow = ai.defineFlow(
  {
    name: 'recommendContestFlow',
    inputSchema: RecommendContestInputSchema,
    outputSchema: RecommendContestOutputSchema,
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

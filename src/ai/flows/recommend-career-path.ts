'use server';
/**
 * @fileOverview An AI agent that recommends a career path based on student performance.
 *
 * - recommendCareerPath - A function that handles the career path recommendation.
 * - RecommendCareerPathInput - The input type for the function.
 * - RecommendCareerPathOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
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
  model: deepseekChat,
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
    try {
      const {output} = await prompt(input);
      const result = output || {};
      const formattedResult: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(result)) {
        if (typeof value === 'string') {
          // Use educational formatting for career guidance content
          formattedResult[key] = validateAndFormatResponse(value, 'educational');
        } else {
          formattedResult[key] = value;
        }
      }
      
      return formattedResult as RecommendCareerPathOutput;
    } catch (error: any) {
      // Handle DeepSeek response format issues
      console.error('Error with career path AI prompt:', error);
      
      // If there's a schema validation error, try to extract data from the error details
      if (error.detail && error.originalMessage) {
        const errorMessage = error.originalMessage;
        if (errorMessage.includes('recommendedPaths') || errorMessage.includes('career')) {
          try {
            // Extract JSON from the error message
            const jsonMatch = errorMessage.match(/```json\n({[\s\S]*?})\n```/);
            if (jsonMatch) {
              const parsedData = JSON.parse(jsonMatch[1]);
              if (parsedData.recommendedPaths || parsedData.subjectRecommendations) {
                const formattedResult: Record<string, any> = {};
                
                for (const [key, value] of Object.entries(parsedData)) {
                  if (typeof value === 'string') {
                    formattedResult[key] = validateAndFormatResponse(value, 'educational');
                  } else {
                    formattedResult[key] = value;
                  }
                }
                
                return formattedResult as RecommendCareerPathOutput;
              }
            }
          } catch (parseError) {
            console.error('Failed to parse career path data from error:', parseError);
          }
        }
      }
      
      // Fallback: generate basic career recommendations
      const fallbackRecommendations = generateFallbackCareerRecommendations(input);
      return fallbackRecommendations;
    }
  }
);

// Fallback career recommendations generator
function generateFallbackCareerRecommendations(input: RecommendCareerPathInput): RecommendCareerPathOutput {
  const { strongestSubjects, interests, recentScores } = input;
  
  // Generate basic career recommendations based on strongest subjects
  const careerMappings: Record<string, { career: string; field: string; reasoning: string }[]> = {
    Mathematics: [
      { career: "Data Scientist", field: "Technology", reasoning: "Strong math skills are essential for statistical analysis and machine learning." },
      { career: "Financial Analyst", field: "Finance", reasoning: "Mathematical proficiency is crucial for financial modeling and analysis." }
    ],
    Science: [
      { career: "Research Scientist", field: "Research & Development", reasoning: "Scientific knowledge provides a strong foundation for research careers." },
      { career: "Medical Professional", field: "Healthcare", reasoning: "Science background is essential for understanding medical concepts." }
    ],
    English: [
      { career: "Content Writer", field: "Communications", reasoning: "Strong language skills translate well to writing and communication roles." },
      { career: "Teacher", field: "Education", reasoning: "English proficiency is valuable for educational and training positions." }
    ],
    Technology: [
      { career: "Software Developer", field: "Technology", reasoning: "Technology skills are directly applicable to software development careers." },
      { career: "IT Consultant", field: "Technology", reasoning: "Technical knowledge is valuable for consulting and system design roles." }
    ]
  };
  
  const recommendedPaths: { career: string; field: string; reasoning: string }[] = [];
  
  // Generate recommendations based on strongest subjects
  for (const subject of strongestSubjects.slice(0, 2)) {
    const mappings = careerMappings[subject] || [
      { career: `${subject} Specialist`, field: "Education", reasoning: `Your strength in ${subject} makes you well-suited for specialized roles in this field.` }
    ];
    recommendedPaths.push(...mappings.slice(0, 2));
  }
  
  // Fill remaining slots with general recommendations
  while (recommendedPaths.length < 4) {
    recommendedPaths.push({
      career: "Project Manager",
      field: "Business",
      reasoning: "Strong academic performance indicates good organizational and analytical skills suitable for project management."
    });
  }
  
  const subjectRecommendations = `## Subject Focus Recommendations\n\n` +
    `**Continue Excelling In:** ${strongestSubjects.join(', ')}\n\n` +
    `**Areas for Improvement:** Focus on strengthening your foundation in weaker subjects as they can complement your strengths.\n\n` +
    `**New Skills to Explore:** Consider developing skills in communication, critical thinking, and digital literacy to enhance your career prospects.`;
  
  return {
    recommendedPaths: recommendedPaths.slice(0, 4),
    subjectRecommendations: validateAndFormatResponse(subjectRecommendations, 'educational')
  };
}

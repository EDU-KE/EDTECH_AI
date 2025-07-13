'use server';
/**
 * @fileOverview Generates a scheme of work as a Markdown table with dynamic week count.
 */

import { ai } from '@/ai/genkit';
import { validateAndFormatResponse } from '@/ai/response-formatter';
import { deepseekChat } from 'genkitx-deepseek';
import { z } from 'genkit';

// Step 1: Base input schema (used by API)
const GenerateSchemeOfWorkInputSchema = z.object({
  subject: z.string().describe('The subject for the scheme of work (e.g., Physics).'),
  gradeLevel: z.string().describe('The grade level or year group (e.g., 10th Grade).'),
  termDuration: z.string().describe('The duration of the academic term (e.g., 12 weeks).'),
});
export type GenerateSchemeOfWorkInput = z.infer<typeof GenerateSchemeOfWorkInputSchema>;

// Step 2: Extended schema for prompt use (adds 'weeks')
const PromptInputSchema = GenerateSchemeOfWorkInputSchema.extend({
  weeks: z.string().describe('Number of weeks in the term, extracted from termDuration'),
});

// Output schema
const GenerateSchemeOfWorkOutputSchema = z.object({
  schemeOfWork: z.string().describe('A Markdown table of the scheme of work, with a row for each week.'),
});
export type GenerateSchemeOfWorkOutput = z.infer<typeof GenerateSchemeOfWorkOutputSchema>;

// Main function to export
export async function generateSchemeOfWork(input: GenerateSchemeOfWorkInput): Promise<GenerateSchemeOfWorkOutput> {
  return generateSchemeOfWorkFlow(input);
}

// Extracts week count as number
function extractWeeks(termDuration: string): number {
  const match = termDuration.match(/\d+/);
  return match ? parseInt(match[0]) : 12;
}

// Prompt definition (uses extended schema)
const prompt = ai.definePrompt({
  name: 'generateSchemeOfWorkPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: GenerateSchemeOfWorkOutputSchema },
  model: deepseekChat,
  prompt: `You are an experienced head of department. Create a detailed **scheme of work** for the following:

- **Subject**: {{{subject}}}
- **Grade Level**: {{{gradeLevel}}}
- **Term Duration**: {{{termDuration}}} ({{{weeks}}} weeks total)

The output should be a **Markdown table** with exactly {{{weeks}}} rows — one for each week. Each row should include:

- Week number
- Topic
- Learning Objectives
- Suggested Activities

### Format:
| Week | Topic | Learning Objectives | Activities |
|------|-------|----------------------|------------|
| 1    | ...   | ...                  | ...        |

Now generate the scheme.`,
});

// Flow definition
const generateSchemeOfWorkFlow = ai.defineFlow(
  {
    name: 'generateSchemeOfWorkFlow',
    inputSchema: GenerateSchemeOfWorkInputSchema,
    outputSchema: GenerateSchemeOfWorkOutputSchema,
  },
  async input => {
    const weeks = extractWeeks(input.termDuration);

    // Type-safe merged input for prompt
    const promptInput = PromptInputSchema.parse({
      ...input,
      weeks: weeks.toString(),
    });

    try {
      const { output } = await prompt(promptInput);

      const result = output || {};
      const formattedResult: Record<string, any> = {};

      for (const [key, value] of Object.entries(result)) {
        if (typeof value === 'string') {
          // Use scheme-of-work specific formatting for scheme of work content
          formattedResult[key] = validateAndFormatResponse(value, 'scheme-of-work');
        } else {
          formattedResult[key] = value;
        }
      }

      return formattedResult as GenerateSchemeOfWorkOutput;
    } catch (error: any) {
      // Handle DeepSeek response format issues
      console.error('Error with AI prompt:', error);
      
      // If there's a schema validation error, try to extract the text from the error details
      if (error.detail && error.originalMessage) {
        // Try to parse the scheme of work from the error message if it contains the actual response
        const errorMessage = error.originalMessage;
        if (errorMessage.includes('schemeOfWork')) {
          try {
            // Extract JSON from the error message
            const jsonMatch = errorMessage.match(/```json\n({[\s\S]*?})\n```/);
            if (jsonMatch) {
              const parsedData = JSON.parse(jsonMatch[1]);
              if (parsedData.schemeOfWork) {
                return {
                  schemeOfWork: validateAndFormatResponse(parsedData.schemeOfWork, 'scheme-of-work')
                };
              }
            }
          } catch (parseError) {
            console.error('Failed to parse scheme of work from error:', parseError);
          }
        }
      }
      
      // Fallback: generate a basic scheme of work structure
      const fallbackScheme = generateFallbackScheme(input.subject, input.gradeLevel, weeks);
      return {
        schemeOfWork: validateAndFormatResponse(fallbackScheme, 'scheme-of-work')
      };
    }
  }
);

// Fallback scheme generator
function generateFallbackScheme(subject: string, gradeLevel: string, weeks: number): string {
  const baseTopics = [
    "Introduction and Fundamentals",
    "Core Concepts",
    "Practical Applications",
    "Advanced Topics",
    "Review and Assessment"
  ];
  
  let scheme = `| Week | Topic | Learning Objectives | Activities |\n|------|-------|----------------------|------------|\n`;
  
  for (let i = 1; i <= weeks; i++) {
    const topicIndex = Math.floor((i - 1) / (weeks / baseTopics.length));
    const topic = baseTopics[Math.min(topicIndex, baseTopics.length - 1)] || `${subject} Topic ${i}`;
    
    scheme += `| ${i} | ${topic} | Understand key concepts in ${subject} | Interactive lessons and practice exercises |\n`;
  }
  
  return scheme;
}

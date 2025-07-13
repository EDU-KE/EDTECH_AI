import fetch from 'node-fetch';
import { z, ZodSchema } from 'zod';
import { parseJsonFromLLM } from './parseJsonFromLLM';

/**
 * @fileOverview Unified DeepSeek AI response handler with Zod validation
 * Following the established pattern for clean, validated AI responses
 */

export interface DeepSeekRequestOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

/**
 * Makes a request to DeepSeek API and returns validated, cleaned response
 */
export async function generateWithDeepSeekAPI<T>(
  options: DeepSeekRequestOptions,
  schema: ZodSchema<T>
): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
  }

  const {
    systemPrompt,
    userPrompt,
    temperature = 0.7,
    maxTokens = 4000,
    model = 'deepseek-chat'
  } = options;

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ DeepSeek API error:', data);
      throw new Error(data?.error?.message || 'Unknown DeepSeek API error');
    }

    const rawText = data.choices?.[0]?.message?.content || '';
    
    if (!rawText) {
      throw new Error('No content received from DeepSeek API');
    }

    // Parse and validate the response using Zod
    return parseJsonFromLLM(rawText, schema);

  } catch (error) {
    console.error('❌ Error in generateWithDeepSeekAPI:', error);
    throw error;
  }
}

/**
 * Educational content system prompts optimized for clean JSON responses
 */
export const EDUCATIONAL_SYSTEM_PROMPTS = {
  tutor: `You are an expert AI tutor with deep knowledge across all academic subjects. 
Your responses should be clear, educational, and adapted to the student's level.
Always respond in JSON format with the exact key structure requested.
Keep explanations concise but comprehensive, and use proper educational language.`,

  lessonPlanner: `You are an expert curriculum developer and lesson planner.
Create well-structured, engaging lesson plans suitable for the specified duration and objectives.
Always respond in JSON format with clean Markdown formatting for educational content.
Include clear sections for objectives, activities, materials, and assessment.`,

  analyst: `You are an expert educational analyst with deep understanding of academic subjects.
Provide objective, data-driven analysis with actionable insights.
Always respond in JSON format with clear, structured educational content.
Use evidence-based reasoning and present findings in an accessible way.`,

  examiner: `You are an expert educational assessor and exam creator.
Create fair, comprehensive, and educationally sound assessments.
Always respond in JSON format with properly formatted questions and clear instructions.
Ensure content is appropriate for the specified academic level.`,

  advisor: `You are an expert educational advisor with knowledge of career paths and academic guidance.
Provide helpful, realistic advice tailored to the student's interests and abilities.
Always respond in JSON format with structured, actionable recommendations.
Consider both academic and practical aspects of career development.`,

  researcher: `You are an expert research assistant specialized in educational content.
Provide comprehensive, accurate summaries based on established knowledge.
Always respond in JSON format with well-structured, informative content.
Use clear headings, bullet points, and logical organization.`,
};

/**
 * Helper function to create educational prompts with JSON response instructions
 */
export function createEducationalPrompt(
  basePrompt: string,
  responseFormat: string,
  additionalInstructions?: string
): string {
  const jsonInstruction = `

Respond in JSON format with the following structure:
${responseFormat}

${additionalInstructions || ''}

Ensure your response is valid JSON and follows the exact key names specified.`;

  return basePrompt + jsonInstruction;
}

/**
 * Predefined response format templates for common educational content
 */
export const RESPONSE_FORMATS = {
  tutoring: `{
  "answer": "Your clear, educational explanation here"
}`,

  lessonPlan: `{
  "lessonPlan": "## Lesson Title\\n\\n### Learning Objectives\\n- Objective 1\\n\\n### Materials\\n- Material 1\\n\\n### Activities\\n- Activity 1\\n\\n### Assessment\\n- Assessment method"
}`,

  analysis: `{
  "analysis": "Your detailed analysis with clear structure and educational insights"
}`,

  studyGuide: `{
  "studyGuide": "# Study Guide\\n\\n## Key Concepts\\n- Concept 1\\n\\n## Important Notes\\n- Note 1"
}`,

  webSearch: `{
  "summary": "# Topic Summary\\n\\nComprehensive summary with clear headings and bullet points"
}`,

  recommendations: `{
  "recommendations": "## Recommendations\\n\\n1. First recommendation\\n2. Second recommendation"
}`,

  grading: `{
  "feedback": "Detailed feedback on performance",
  "grade": 85,
  "suggestions": "Specific suggestions for improvement"
}`,
};

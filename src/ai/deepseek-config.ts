/**
 * @fileOverview AI System Configuration for DeepSeek Integration
 * This file contains system-wide configuration for optimal DeepSeek performance
 */

import { ai } from './genkit';
import { getModel, TASK_MODELS } from './model-config';

/**
 * Default generation parameters optimized for DeepSeek models
 */
export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 4096,
  topP: 0.9,
  topK: 40,
  stopSequences: [],
} as const;

/**
 * Task-specific generation configurations
 */
export const TASK_CONFIGS = {
  // Educational content - balanced creativity and accuracy
  educational: {
    temperature: 0.7,
    maxOutputTokens: 3000,
    topP: 0.9,
  },
  
  // Analysis tasks - lower temperature for accuracy
  analysis: {
    temperature: 0.3,
    maxOutputTokens: 2000,
    topP: 0.8,
  },
  
  // Creative tasks - higher temperature for diversity
  creative: {
    temperature: 0.8,
    maxOutputTokens: 4000,
    topP: 0.9,
  },
  
  // Fast tasks - optimized for speed
  fast: {
    temperature: 0.5,
    maxOutputTokens: 1500,
    topP: 0.8,
  },
  
  // Reasoning tasks - balanced for logical thinking
  reasoning: {
    temperature: 0.4,
    maxOutputTokens: 3000,
    topP: 0.85,
  },
} as const;

/**
 * Enhanced AI generate function with DeepSeek optimizations
 */
export async function generateWithDeepSeek({
  prompt,
  taskType = 'educational',
  model,
  schema,
  systemPrompt,
  ...options
}: {
  prompt: string;
  taskType?: keyof typeof TASK_CONFIGS;
  model?: string;
  schema?: any;
  systemPrompt?: string;
  [key: string]: any;
}) {
  const config = TASK_CONFIGS[taskType];
  const selectedModel = model || getModel('PRIMARY');
  
  const fullPrompt = systemPrompt 
    ? `${systemPrompt}\n\n${prompt}`
    : prompt;
  
  return await ai.generate({
    prompt: fullPrompt,
    model: selectedModel,
    config: {
      ...DEFAULT_GENERATION_CONFIG,
      ...config,
      ...options,
    },
    output: schema ? { schema } : undefined,
  });
}

/**
 * System prompts optimized for DeepSeek
 */
export const SYSTEM_PROMPTS = {
  tutor: `You are an expert AI tutor with deep knowledge across all academic subjects. 
Your responses should be:
- Clear and educational
- Adapted to the student's level
- Include practical examples
- Encourage critical thinking
- Be supportive and motivating`,

  analyst: `You are an expert educational analyst. 
Your analysis should be:
- Objective and data-driven
- Provide actionable insights
- Consider multiple perspectives
- Use evidence-based reasoning
- Present findings clearly`,

  creator: `You are a creative educational content generator.
Your content should be:
- Engaging and interactive
- Age-appropriate
- Educationally sound
- Creative but accurate
- Well-structured and organized`,

  assessor: `You are an expert educational assessor.
Your assessments should be:
- Fair and unbiased
- Constructive and helpful
- Specific and detailed
- Include improvement suggestions
- Recognize strengths and areas for growth`,
} as const;

/**
 * Error handling for DeepSeek API calls
 */
export function handleDeepSeekError(error: any): string {
  if (error?.message?.includes('API key')) {
    return 'DeepSeek API key is invalid or missing. Please check your DEEPSEEK_API_KEY environment variable.';
  }
  
  if (error?.message?.includes('rate limit')) {
    return 'Rate limit exceeded. Please try again in a few moments.';
  }
  
  if (error?.message?.includes('model not found')) {
    return 'DeepSeek model not available. Please check the model name.';
  }
  
  return `AI generation error: ${error?.message || 'Unknown error occurred'}`;
}

/**
 * Validate DeepSeek configuration
 */
export function validateDeepSeekConfig(): boolean {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    console.error('❌ DeepSeek API key is missing or using placeholder value');
    return false;
  }
  
  console.log('✅ DeepSeek configuration validated');
  return true;
}

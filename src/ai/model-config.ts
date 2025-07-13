/**
 * @fileOverview Model configuration for the AI system
 * Defines which models to use for different types of tasks
 */

import { deepseekChat, deepseekReasoner } from 'genkitx-deepseek';

export const MODEL_CONFIG = {
  // Primary model for most AI tasks
  PRIMARY: deepseekChat,
  
  // Model for complex reasoning and analysis
  REASONING: deepseekReasoner,
  
  // Model for coding and technical tasks
  CODING: deepseekChat,
  
  // Model for creative writing and content generation
  CREATIVE: deepseekChat,
  
  // Model for fast, simple tasks
  FAST: deepseekChat,
} as const;

export type ModelType = keyof typeof MODEL_CONFIG;

/**
 * Get the appropriate model for a given task type
 */
export function getModel(taskType: ModelType = 'PRIMARY') {
  return MODEL_CONFIG[taskType];
}

/**
 * Model configuration for different AI tasks
 */
export const TASK_MODELS = {
  // Educational content generation
  tutoring: MODEL_CONFIG.PRIMARY,
  lessonPlan: MODEL_CONFIG.PRIMARY,
  studyGuide: MODEL_CONFIG.PRIMARY,
  examQuestions: MODEL_CONFIG.PRIMARY,
  
  // Analysis tasks
  grading: MODEL_CONFIG.REASONING,
  analysis: MODEL_CONFIG.REASONING,
  assessment: MODEL_CONFIG.REASONING,
  
  // Creative tasks
  presentation: MODEL_CONFIG.CREATIVE,
  diary: MODEL_CONFIG.CREATIVE,
  recommendations: MODEL_CONFIG.CREATIVE,
  
  // Technical tasks
  webSearch: MODEL_CONFIG.FAST,
  summary: MODEL_CONFIG.FAST,
  
  // Complex reasoning
  careerPath: MODEL_CONFIG.REASONING,
  learningPath: MODEL_CONFIG.REASONING,
} as const;

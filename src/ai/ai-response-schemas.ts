import { z } from 'zod';

/**
 * @fileOverview Zod schemas for validating and cleaning AI-generated educational content
 * Following the parseJsonFromLLM pattern for consistent data validation
 */

// Base text cleaning transform
const cleanText = z.string()
  .transform((str) => str
    .trim()
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')     // Limit consecutive newlines
    .replace(/^\s*[\r\n]/gm, '')    // Remove empty lines
  );

// Enhanced text with markdown support
const cleanMarkdownText = z.string()
  .transform((str) => str
    .trim()
    .replace(/\r\n/g, '\n')         // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')     // Limit consecutive newlines
    .replace(/\t/g, '  ')           // Convert tabs to spaces
    .replace(/[ \t]+$/gm, '')       // Remove trailing spaces
  );

// Helper function to convert any object structure to formatted text
function convertObjectToFormattedText(obj: any): string {
  let result = '';
  
  for (const [key, value] of Object.entries(obj)) {
    const formattedKey = key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
    
    if (Array.isArray(value)) {
      result += `## ${formattedKey}\n`;
      result += value.map(item => `• ${String(item)}`).join('\n') + '\n\n';
    } else if (typeof value === 'object' && value !== null) {
      result += `## ${formattedKey}\n`;
      result += convertObjectToFormattedText(value) + '\n\n';
    } else {
      result += `${String(value)}\n\n`;
    }
  }
  
  return result.trim();
}

// Flexible JSON handler that can process any structure
const flexibleJSONToText = z.any()
  .transform((data) => {
    if (typeof data === 'string') {
      return data.trim();
    }
    
    if (typeof data === 'object' && data !== null) {
      return convertObjectToFormattedText(data);
    }
    
    return String(data);
  });

// Educational content with proper structure
const educationalContent = z.any()
  .transform((data) => {
    let text = '';
    
    if (typeof data === 'string') {
      text = data;
    } else {
      text = convertObjectToFormattedText(data);
    }
    
    return text
      .trim()
      .replace(/^\#+\s*/gm, '')       // Clean excessive headers
      .replace(/\*{3,}/g, '**')       // Normalize bold formatting
      .replace(/_{3,}/g, '__')        // Normalize italic formatting
      .replace(/`{3,}/g, '```')       // Normalize code blocks
      .replace(/\n{3,}/g, '\n\n');   // Limit consecutive newlines
  });

/**
 * Schema for AI Tutoring responses
 */
export const TutoringResponseSchema = z.object({
  answer: flexibleJSONToText.describe('The tutoring answer with clean formatting'),
});

/**
 * Schema for Lesson Plan responses
 */
export const LessonPlanResponseSchema = z.object({
  lessonPlan: educationalContent.describe('A detailed lesson plan formatted as clean Markdown'),
});

/**
 * Schema for Subject Analysis responses
 */
export const SubjectAnalysisResponseSchema = z.object({
  analysis: flexibleJSONToText.describe('Analysis of the subject with clean educational formatting'),
});

/**
 * Schema for Exam Questions responses
 */
export const ExamQuestionsResponseSchema = z.object({
  questions: flexibleJSONToText.describe('Generated exam questions with clean formatting'),
});

/**
 * Schema for Study Guide responses
 */
export const StudyGuideResponseSchema = z.object({
  guide: educationalContent.describe('Comprehensive study guide formatted as clean Markdown'),
});

/**
 * Schema for Class Notes responses
 */
export const ClassNotesResponseSchema = z.object({
  notes: educationalContent.describe('Organized class notes with proper structure'),
});

/**
 * Schema for Web Search responses
 */
export const WebSearchResponseSchema = z.object({
  searchResults: flexibleJSONToText.describe('Educational web search results with summaries'),
});

/**
 * Schema for Study Tips responses
 */
export const StudyTipsResponseSchema = z.object({
  tips: flexibleJSONToText.describe('Practical study tips formatted clearly'),
});

/**
 * Schema for Career Path responses
 */
export const CareerPathResponseSchema = z.object({
  careerInfo: educationalContent.describe('Career path information with structured guidance'),
});

/**
 * Schema for Progress Insights responses
 */
export const ProgressInsightsResponseSchema = z.object({
  insights: flexibleJSONToText.describe('Student progress insights with actionable feedback'),
});

/**
 * Schema for Personalized Learning Path responses
 */
export const LearningPathResponseSchema = z.object({
  learningPath: educationalContent.describe('Customized learning path with clear milestones'),
});

/**
 * Schema for Scheme of Work responses
 */
export const SchemeOfWorkResponseSchema = z.object({
  scheme: educationalContent.describe('Detailed scheme of work for educational planning'),
});

/**
 * Schema for Recommendations responses
 */
export const RecommendationsResponseSchema = z.object({
  recommendations: flexibleJSONToText.describe('Educational recommendations with explanations'),
});

/**
 * Schema for Presentation Generation responses
 */
export const PresentationResponseSchema = z.object({
  presentation: educationalContent.describe('Structured presentation content with slides'),
});

/**
 * Schema for Notes Summarization responses
 */
export const SummaryResponseSchema = z.object({
  summary: educationalContent.describe('Concise summary of educational content'),
});

/**
 * Schema for Chat Tone Analysis responses
 */
export const ChatToneResponseSchema = z.object({
  analysis: flexibleJSONToText.describe('Analysis of chat tone and communication patterns'),
});

/**
 * Schema for Activity Analysis responses
 */
export const ActivityAnalysisResponseSchema = z.object({
  analysis: flexibleJSONToText.describe('Student activity analysis with insights'),
});

/**
 * Schema for Exam Explanation responses
 */
export const ExamExplanationResponseSchema = z.object({
  explanation: educationalContent.describe('Detailed explanation of exam topics'),
});

/**
 * Schema for Exam Grading responses
 */
export const GradingResponseSchema = z.object({
  feedback: flexibleJSONToText.describe('Detailed grading feedback with scores and suggestions'),
  grade: z.number().min(0).max(100).optional().describe('Optional numerical grade from 0 to 100'),
});

/**
 * Schema for Diary Advice responses
 */
export const DiaryAdviceResponseSchema = z.object({
  advice: educationalContent.describe('Personal diary advice with supportive guidance'),
});

/**
 * Schema for Tutor Recommendations responses
 */
export const TutorRecommendationResponseSchema = z.object({
  recommendations: flexibleJSONToText.describe('Tutor recommendations with matching criteria'),
});

/**
 * Schema for Contest Recommendations responses
 */
export const ContestRecommendationResponseSchema = z.object({
  contests: flexibleJSONToText.describe('Contest recommendations with details and benefits'),
});

/**
 * Schema for Chat Response Suggestions
 */
export const ChatSuggestionResponseSchema = z.object({
  suggestion: flexibleJSONToText.describe('Suggested response for educational chat'),
});

/**
 * Generic schema for any AI response with text cleaning
 */
export const GenericAIResponseSchema = z.object({
  content: flexibleJSONToText.describe('Generic AI response with clean text formatting'),
});

/**
 * Helper type for all possible response schemas
 */
export type AIResponseSchemas = 
  | typeof TutoringResponseSchema
  | typeof LessonPlanResponseSchema
  | typeof SubjectAnalysisResponseSchema
  | typeof StudyGuideResponseSchema
  | typeof ExamQuestionsResponseSchema
  | typeof StudyTipsResponseSchema
  | typeof LearningPathResponseSchema
  | typeof ProgressInsightsResponseSchema
  | typeof CareerPathResponseSchema
  | typeof WebSearchResponseSchema
  | typeof ClassNotesResponseSchema
  | typeof PresentationResponseSchema
  | typeof DiaryAdviceResponseSchema
  | typeof RecommendationsResponseSchema
  | typeof SchemeOfWorkResponseSchema
  | typeof ChatToneResponseSchema
  | typeof ActivityAnalysisResponseSchema
  | typeof ContestRecommendationResponseSchema
  | typeof TutorRecommendationResponseSchema
  | typeof ChatSuggestionResponseSchema
  | typeof SummaryResponseSchema
  | typeof ExamExplanationResponseSchema
  | typeof GradingResponseSchema
  | typeof GenericAIResponseSchema;

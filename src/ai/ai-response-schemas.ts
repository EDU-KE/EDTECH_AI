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

// Scheme of Work specific content transform
const schemeOfWorkContent = z.string()
  .transform((str) => str
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Ensure proper markdown table formatting
    .replace(/\|\s*([^|]+)\s*\|/g, '| $1 |')
    .replace(/\|\s+\|/g, '| |')
    // Clean up table headers
    .replace(/\|\s*(Week|Topic|Learning Objectives?|Activities?|Objectives?|Activity)\s*\|/gi, '| **$1** |')
    // Clean up table separator
    .replace(/\|\s*-+\s*\|/g, '|------|')
    // Clean up week numbers
    .replace(/\|\s*(\d+)\s*\|/g, '| **Week $1** |')
    // Remove excessive newlines but preserve table structure
    .replace(/\n{3,}/g, '\n\n')
    // Remove trailing spaces
    .replace(/[ \t]+$/gm, '')
    // Ensure proper spacing after periods in cells
    .replace(/\.([A-Z])/g, '. $1')
  );

// Career guidance specific content transform
const careerGuidanceContent = z.string()
  .transform((str) => str
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Format career sections
    .replace(/^(Career Path|Recommended Career|Subject Recommendations?):?/gim, '## $1')
    // Format career fields
    .replace(/^(Field:?)\s*/gim, '**$1** ')
    // Format reasoning sections
    .replace(/^(Reasoning:?|Why:?)\s*/gim, '**$1** ')
    // Format subject advice sections
    .replace(/^(Continue Excelling In|Areas for Improvement|New Skills to Explore):?/gim, '### $1')
    // Format skill lists
    .replace(/^(\s*)(Skills?:?)\s*/gim, '$1**$2** ')
    // Format career path bullet points
    .replace(/^(\s*)[-*]\s*(.*?:)/gm, '$1• **$2**')
    // Remove excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove trailing spaces
    .replace(/[ \t]+$/gm, '')
  );

// Web search specific content transform
const webSearchContent = z.string()
  .transform((str) => str
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Format search result sections
    .replace(/^(Search Results?|Summary|Overview|Key Points?):?/gim, '## $1')
    // Format source references
    .replace(/^(Sources?|References?):?/gim, '### $1')
    // Format research suggestions
    .replace(/^(Research Suggestions?|Next Steps?|Additional Resources?):?/gim, '### $1')
    // Format search tips
    .replace(/^(Search Tips?|How to Research|Find More):?/gim, '### $1')
    // Format educational sections
    .replace(/^(Definition|Background|Key Information|Important Facts?):?/gim, '### $1')
    // Format academic references
    .replace(/^(\s*)(Academic|Educational|Official):?/gim, '$1**$2:**')
    // Format search result bullet points
    .replace(/^(\s*)[-*]\s*(.*?:)/gm, '$1• **$2**')
    // Remove excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove trailing spaces
    .replace(/[ \t]+$/gm, '')
  );

// Learning Path Content Transformer
export const learningPathContentTransformer = z.any()
  .transform((content) => {
    if (typeof content === 'string') {
      return content;
    }
    
    if (typeof content === 'object' && content !== null) {
      // Handle structured learning path data
      if (content.learningPath) {
        return String(content.learningPath);
      }
      
      if (content.path || content.curriculum) {
        return String(content.path || content.curriculum);
      }
      
      // Handle step-by-step learning paths
      if (content.steps || content.modules || content.weeks) {
        const steps = content.steps || content.modules || content.weeks;
        let result = '# Personalized Learning Path\n\n';
        
        if (Array.isArray(steps)) {
          steps.forEach((step: any, index: number) => {
            result += `## Step ${index + 1}: ${step.title || step.name || `Module ${index + 1}`}\n\n`;
            if (step.description) {
              result += `${step.description}\n\n`;
            }
            if (step.objectives) {
              result += `**Learning Objectives:**\n`;
              const objectives = Array.isArray(step.objectives) ? step.objectives : [step.objectives];
              result += objectives.map((obj: any) => `• ${obj}`).join('\n') + '\n\n';
            }
            if (step.duration) {
              result += `**Duration:** ${step.duration}\n\n`;
            }
            if (step.resources) {
              result += `**Resources:**\n`;
              const resources = Array.isArray(step.resources) ? step.resources : [step.resources];
              result += resources.map((res: any) => `• ${res}`).join('\n') + '\n\n';
            }
            result += '---\n\n';
          });
        }
        return result;
      }
      
      // Fallback: convert object to formatted text
      return convertObjectToFormattedText(content);
    }
    
    return String(content);
  });

// Web Search Content Transformer
export const webSearchContentTransformer = z.any()
  .transform((content) => {
    if (typeof content === 'string') {
      return content;
    }
    
    if (typeof content === 'object' && content !== null) {
      // Handle structured web search data
      if (content.searchResults || content.summary) {
        return String(content.searchResults || content.summary);
      }
      
      if (content.results) {
        const results = content.results;
        if (Array.isArray(results)) {
          let output = '# Search Results\n\n';
          results.forEach((result: any, index: number) => {
            output += `## Result ${index + 1}\n\n`;
            if (result.title) output += `**Title:** ${result.title}\n\n`;
            if (result.description) output += `${result.description}\n\n`;
            if (result.url) output += `**Source:** ${result.url}\n\n`;
            output += '---\n\n';
          });
          return output;
        }
      }
      
      // Fallback: convert object to formatted text
      return convertObjectToFormattedText(content);
    }
    
    return String(content);
  });

// Lesson Plan Content Transformer
export const lessonPlanContentTransformer = z.any()
  .transform((content) => {
    if (typeof content === 'string') {
      return content;
    }
    
    if (typeof content === 'object' && content !== null) {
      // Handle structured lesson plan data
      if (content.lessonPlan) {
        return String(content.lessonPlan);
      }
      
      if (content.plan || content.curriculum) {
        return String(content.plan || content.curriculum);
      }
      
      // Handle detailed lesson plan structure
      if (content.subject || content.topic || content.objectives) {
        let result = `# Lesson Plan: ${content.topic || 'Learning Session'}\n\n`;
        
        if (content.subject) {
          result += `**Subject:** ${content.subject}\n\n`;
        }
        
        if (content.duration) {
          result += `**Duration:** ${content.duration}\n\n`;
        }
        
        if (content.objectives) {
          result += `## Learning Objectives\n${content.objectives}\n\n`;
        }
        
        if (content.materials) {
          result += `## Materials\n`;
          const materials = Array.isArray(content.materials) ? content.materials : [content.materials];
          result += materials.map((material: any) => `• ${material}`).join('\n') + '\n\n';
        }
        
        if (content.activities) {
          result += `## Activities\n`;
          const activities = Array.isArray(content.activities) ? content.activities : [content.activities];
          activities.forEach((activity: any, index: number) => {
            result += `### Activity ${index + 1}\n${activity}\n\n`;
          });
        }
        
        if (content.assessment) {
          result += `## Assessment\n${content.assessment}\n\n`;
        }
        
        return result;
      }
      
      // Fallback: convert object to formatted text
      return convertObjectToFormattedText(content);
    }
    
    return String(content);
  });

// Response Schemas
export const LessonPlanResponseSchema = z.object({
  lessonPlan: z.string().describe('A detailed lesson plan with clear structure, activities, and assessment methods'),
});

export const SubjectAnalysisResponseSchema = z.object({
  analysis: z.string().describe('A comprehensive analysis of the subject with strengths, weaknesses, and recommendations'),
});

export const TutoringResponseSchema = z.object({
  answer: z.string().describe('A personalized tutoring response with explanations and guidance'),
});

export const WebSearchResponseSchema = z.object({
  searchResults: z.string().describe('Summarized web search results formatted for educational use'),
});

/**
 * @fileOverview Response formatter for DeepSeek AI outputs
 * Ensures proper formatting for display in UI components
 */

/**
 * Formats AI responses for better display in UI cards
 */
export function formatAIResponse(text: string): string {
  if (!text) return '';
  
  return text
    // Remove excessive whitespace
    .trim()
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove multiple consecutive newlines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Ensure proper spacing after periods
    .replace(/\.([A-Z])/g, '. $1')
    // Clean up any markdown artifacts that might not render well
    .replace(/^\s*#+\s*/gm, '') // Remove markdown headers for plain text
    // Ensure consistent bullet points
    .replace(/^\s*[-*+]\s*/gm, '• ')
    // Clean up numbered lists
    .replace(/^\s*(\d+)\.\s*/gm, '$1. ')
    // Remove trailing spaces
    .replace(/[ \t]+$/gm, '');
}

/**
 * Formats markdown content specifically for cards
 */
export function formatMarkdownForCards(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    // Ensure proper heading spacing
    .replace(/^(#{1,6})\s*(.+)$/gm, '$1 $2\n')
    // Ensure proper list spacing
    .replace(/^(\s*[-*+]\s*.+)$/gm, '$1')
    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')
    // Clean up any HTML tags that might have leaked through
    .replace(/<[^>]*>/g, '')
    // Ensure code blocks are properly formatted
    .replace(/```(\w+)?\n/g, '```$1\n')
    .replace(/```\n\n/g, '```\n');
}

/**
 * Formats JSON responses from DeepSeek
 */
export function formatJSONResponse(response: any): string {
  if (typeof response === 'string') {
    return formatAIResponse(response);
  }
  
  if (response && typeof response === 'object') {
    // If it's a structured response, format the main content
    if (response.answer) {
      return formatAIResponse(response.answer);
    }
    if (response.content) {
      return formatAIResponse(response.content);
    }
    if (response.text) {
      return formatAIResponse(response.text);
    }
    if (response.result) {
      return formatAIResponse(response.result);
    }
    
    // For other structured responses, try to extract meaningful text
    const textFields = Object.values(response).filter(
      value => typeof value === 'string' && value.length > 10
    );
    
    if (textFields.length > 0) {
      return formatAIResponse(textFields[0] as string);
    }
  }
  
  return formatAIResponse(String(response));
}

/**
 * Formats educational content specifically
 */
export function formatEducationalContent(text: string): string {
  if (!text) return '';
  
  return formatMarkdownForCards(text)
    // Ensure learning objectives are well formatted
    .replace(/^(Learning Objectives?:?)\s*/gim, '## $1\n')
    // Ensure materials lists are well formatted
    .replace(/^(Materials?:?)\s*/gim, '## $1\n')
    // Ensure assessment sections are well formatted
    .replace(/^(Assessment:?)\s*/gim, '## $1\n')
    // Format time durations nicely
    .replace(/(\d+)\s*(minutes?|mins?|hours?|hrs?)/gi, '$1 $2')
    // Ensure proper formatting for educational sections
    .replace(/^(Introduction:?|Activity:?|Activities:?|Conclusion:?)\s*/gim, '### $1\n');
}

/**
 * Truncates text for preview cards while preserving formatting
 */
export function truncateForPreview(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const lastNewline = truncated.lastIndexOf('\n');
  
  const cutPoint = Math.max(lastSpace, lastNewline);
  
  if (cutPoint > maxLength * 0.7) {
    return truncated.substring(0, cutPoint) + '...';
  }
  
  return truncated + '...';
}

/**
 * Validates and cleans AI response before formatting
 */
export function validateAndFormatResponse(response: any, type: 'educational' | 'general' | 'markdown' = 'general'): string {
  if (!response) {
    return 'No response generated. Please try again.';
  }
  
  try {
    const cleaned = formatJSONResponse(response);
    
    switch (type) {
      case 'educational':
        return formatEducationalContent(cleaned);
      case 'markdown':
        return formatMarkdownForCards(cleaned);
      default:
        return formatAIResponse(cleaned);
    }
  } catch (error) {
    console.error('Error formatting AI response:', error);
    return formatAIResponse(String(response));
  }
}

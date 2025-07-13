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
    // Special handling for scheme of work responses
    if (response.schemeOfWork) {
      return formatSchemeOfWork(response.schemeOfWork);
    }
    if (response.scheme) {
      return formatSchemeOfWork(response.scheme);
    }
    
    // Special handling for career path responses
    if (response.recommendedPaths || response.subjectRecommendations) {
      if (response.subjectRecommendations) {
        return formatCareerGuidance(response.subjectRecommendations);
      }
    }
    
    // Special handling for web search responses
    if (response.searchResults) {
      return formatWebSearchResults(response.searchResults);
    }
    
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
  
  // Check if this looks like a scheme of work (contains table structure)
  if (text.includes('|') && text.includes('Week') && text.includes('Topic')) {
    return formatSchemeOfWork(text);
  }
  
  // Check if this looks like career guidance content
  if (text.includes('Career') || text.includes('Subject Recommendations') || text.includes('Field:')) {
    return formatCareerGuidance(text);
  }
  
  // Check if this looks like web search results
  if (text.includes('Search Results') || text.includes('Research') || text.includes('Sources') || text.includes('Overview')) {
    return formatWebSearchResults(text);
  }
  
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
export function validateAndFormatResponse(response: any, type: 'educational' | 'general' | 'markdown' | 'scheme-of-work' | 'career-guidance' | 'web-search' | 'learning-path' = 'general'): string {
  if (!response) {
    return 'No response generated. Please try again.';
  }
  
  try {
    const cleaned = formatJSONResponse(response);
    
    switch (type) {
      case 'scheme-of-work':
        return formatSchemeOfWork(cleaned);
      case 'career-guidance':
        return formatCareerGuidance(cleaned);
      case 'web-search':
        return formatWebSearchResults(cleaned);
      case 'learning-path':
        return formatLearningPath(cleaned);
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

/**
 * Formats scheme of work markdown tables specifically
 */
export function formatSchemeOfWork(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Ensure proper markdown table formatting
    .replace(/\|\s*([^|]+)\s*\|/g, '| $1 |') // Add spaces around table cell content
    .replace(/\|\s+\|/g, '| |') // Fix empty cells
    // Ensure table headers are properly formatted
    .replace(/\|\s*(Week|Topic|Learning Objectives?|Activities?|Objectives?|Activity)\s*\|/gi, '| **$1** |')
    // Ensure proper table separator formatting
    .replace(/\|\s*-+\s*\|/g, '|------|')
    // Clean up week numbers
    .replace(/\|\s*(\d+)\s*\|/g, '| **Week $1** |')
    // Remove excessive whitespace while preserving table structure
    .replace(/\n{3,}/g, '\n\n')
    // Ensure consistent spacing after periods in table cells
    .replace(/\.([A-Z])/g, '. $1')
    // Format bullet points within table cells
    .replace(/\|\s*([^|]*)([-*•])\s*/g, '| $1• ')
    // Clean up trailing spaces
    .replace(/[ \t]+$/gm, '');
}

/**
 * Formats career path recommendations specifically
 */
export function formatCareerGuidance(text: string): string {
  if (!text) return '';
  
  return formatMarkdownForCards(text)
    // Ensure career sections are well formatted
    .replace(/^(Career Path|Recommended Career|Subject Recommendations?):?/gim, '## $1')
    // Format career fields nicely
    .replace(/^(Field:?)\s*/gim, '**$1** ')
    // Format reasoning sections
    .replace(/^(Reasoning:?|Why:?)\s*/gim, '**$1** ')
    // Ensure proper formatting for subject advice
    .replace(/^(Continue Excelling In|Areas for Improvement|New Skills to Explore):?/gim, '### $1')
    // Format skill lists
    .replace(/^(\s*)(Skills?:?)\s*/gim, '$1**$2** ')
    // Ensure proper bullet points for career paths
    .replace(/^(\s*)[-*]\s*(.*?:)/gm, '$1• **$2**');
}

/**
 * Formats web search results specifically
 */
export function formatWebSearchResults(text: string): string {
  if (!text) return '';
  
  return formatMarkdownForCards(text)
    // Ensure search result sections are well formatted
    .replace(/^(Search Results?|Summary|Overview|Key Points?):?/gim, '## $1')
    // Format source references nicely
    .replace(/^(Sources?|References?):?/gim, '### $1')
    // Format research suggestions
    .replace(/^(Research Suggestions?|Next Steps?|Additional Resources?):?/gim, '### $1')
    // Format search tips
    .replace(/^(Search Tips?|How to Research|Find More):?/gim, '### $1')
    // Ensure proper formatting for search-related sections
    .replace(/^(Definition|Background|Key Information|Important Facts?):?/gim, '### $1')
    // Format academic or educational references
    .replace(/^(\s*)(Academic|Educational|Official):?/gim, '$1**$2:**')
    // Ensure proper bullet points for search results
    .replace(/^(\s*)[-*]\s*(.*?:)/gm, '$1• **$2**');
}

/**
 * Format learning path content with educational structure
 */
export function formatLearningPath(content: string): string {
  try {
    // Remove markdown code blocks if present
    const cleanContent = content.replace(/```(?:json|markdown)?\n?/g, '').trim();
    
    // Check if content is already well-formatted
    if (cleanContent.includes('## Week') || cleanContent.includes('### Module') || cleanContent.includes('**Learning Objectives:**')) {
      return cleanContent;
    }
    
    // Apply learning path formatting
    return cleanContent
      // Format main topics as headers
      .replace(/^(\d+\.\s*[^:\n]+):?\s*$/gm, '## $1\n')
      // Format subtopics
      .replace(/^[-•]\s*([^:\n]+):?\s*$/gm, '### $1\n')
      // Format learning objectives
      .replace(/^(Learning Objectives?|Objectives?|Goals?):\s*$/gmi, '**Learning Objectives:**\n')
      // Format prerequisites
      .replace(/^(Prerequisites?|Required Knowledge):\s*$/gmi, '**Prerequisites:**\n')
      // Format resources
      .replace(/^(Resources?|Materials?|Tools?):\s*$/gmi, '**Recommended Resources:**\n')
      // Format assessments
      .replace(/^(Assessments?|Evaluation|Testing):\s*$/gmi, '**Assessment Methods:**\n')
      // Format timeline
      .replace(/^(Timeline|Duration|Schedule):\s*$/gmi, '**Estimated Timeline:**\n')
      // Add bullet points for lists
      .replace(/^(\d+)\.\s*([^:\n]+)$/gm, '• **Week $1:** $2')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch (error) {
    console.error('Error formatting learning path:', error);
    return content;
  }
}

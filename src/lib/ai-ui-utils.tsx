/**
 * @fileOverview UI utilities for displaying AI responses
 * Helper functions for rendering formatted AI content in components
 */

import { formatJSONResponse, formatMarkdownForCards, truncateForPreview } from '@/ai/response-formatter';

/**
 * Renders AI response text with proper line breaks and formatting for React components
 */
export function renderAIResponse(text: string): React.ReactNode {
  if (!text) return null;
  
  const formatted = formatJSONResponse(text);
  
  // Split by double newlines for paragraphs
  const paragraphs = formatted.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => {
    // Handle bullet points
    if (paragraph.trim().startsWith('•')) {
      const items = paragraph.split('\n').filter(item => item.trim());
      return (
        <ul key={index} className="list-disc list-inside space-y-1 mb-4">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="text-sm">
              {item.replace(/^•\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }
    
    // Handle numbered lists
    if (/^\d+\.\s/.test(paragraph.trim())) {
      const items = paragraph.split('\n').filter(item => item.trim());
      return (
        <ol key={index} className="list-decimal list-inside space-y-1 mb-4">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="text-sm">
              {item.replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ol>
      );
    }
    
    // Handle regular paragraphs
    return (
      <p key={index} className="text-sm leading-relaxed mb-4 last:mb-0">
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

/**
 * Renders markdown content for cards with proper styling
 */
export function renderMarkdownInCard(text: string): React.ReactNode {
  if (!text) return null;
  
  const formatted = formatMarkdownForCards(text);
  
  // Basic markdown rendering for cards
  const lines = formatted.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={currentIndex++} className="text-lg font-bold mb-2 text-gray-900">
          {line.replace(/^# /, '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={currentIndex++} className="text-base font-semibold mb-2 text-gray-800">
          {line.replace(/^## /, '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={currentIndex++} className="text-sm font-medium mb-1 text-gray-700">
          {line.replace(/^### /, '')}
        </h3>
      );
    }
    // Bullet points
    else if (line.startsWith('•') || line.startsWith('- ')) {
      elements.push(
        <div key={currentIndex++} className="flex items-start space-x-2 mb-1">
          <span className="text-blue-500 mt-1">•</span>
          <span className="text-sm text-gray-700">{line.replace(/^[•-]\s*/, '')}</span>
        </div>
      );
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <div key={currentIndex++} className="flex items-start space-x-2 mb-1">
          <span className="text-blue-500 text-sm font-medium">{line.match(/^\d+/)?.[0]}.</span>
          <span className="text-sm text-gray-700">{line.replace(/^\d+\.\s*/, '')}</span>
        </div>
      );
    }
    // Regular text
    else {
      elements.push(
        <p key={currentIndex++} className="text-sm text-gray-700 mb-2 leading-relaxed">
          {line}
        </p>
      );
    }
  }
  
  return <div className="space-y-1">{elements}</div>;
}

/**
 * Creates a preview snippet for cards
 */
export function createPreviewSnippet(text: string, maxLength: number = 100): string {
  return truncateForPreview(formatJSONResponse(text), maxLength);
}

/**
 * Determines the appropriate icon based on content type
 */
export function getContentTypeIcon(content: string): string {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('lesson plan') || lowerContent.includes('learning objectives')) {
    return '📚';
  }
  if (lowerContent.includes('exam') || lowerContent.includes('quiz') || lowerContent.includes('test')) {
    return '📝';
  }
  if (lowerContent.includes('analysis') || lowerContent.includes('assess')) {
    return '📊';
  }
  if (lowerContent.includes('recommendation') || lowerContent.includes('suggest')) {
    return '💡';
  }
  if (lowerContent.includes('tutor') || lowerContent.includes('help')) {
    return '👨‍🏫';
  }
  if (lowerContent.includes('career') || lowerContent.includes('path')) {
    return '🎯';
  }
  
  return '✨'; // Default icon
}

/**
 * Formats response for different card types
 */
export function formatForCardType(
  content: string, 
  cardType: 'summary' | 'detailed' | 'preview' = 'summary'
): React.ReactNode {
  switch (cardType) {
    case 'preview':
      return <span className="text-sm text-gray-600">{createPreviewSnippet(content, 80)}</span>;
    case 'detailed':
      return renderMarkdownInCard(content);
    default:
      return renderAIResponse(content);
  }
}

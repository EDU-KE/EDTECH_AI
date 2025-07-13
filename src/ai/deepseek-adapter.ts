/**
 * @fileOverview DeepSeek Response Adapter
 * Handles the conversion between DeepSeek response format and Genkit expected format
 */
/**
 * Adapts DeepSeek response to Genkit expected format
 */
export function adaptDeepSeekResponse(deepSeekResponse: any): any {
  if (!deepSeekResponse) return null;
  
  // If it's already in the correct format, return as-is
  if (deepSeekResponse.candidates?.[0]?.message?.content) {
    return deepSeekResponse;
  }
  
  // Handle DeepSeek format with text field
  if (deepSeekResponse.candidates?.[0]?.message?.text) {
    const originalCandidate = deepSeekResponse.candidates[0];
    
    return {
      ...deepSeekResponse,
      candidates: [
        {
          ...originalCandidate,
          message: {
            role: originalCandidate.message.role || 'assistant',
            content: [
              {
                text: originalCandidate.message.text
              }
            ]
          }
        }
      ]
    };
  }
  
  // Handle direct text response
  if (typeof deepSeekResponse === 'string') {
    return {
      candidates: [
        {
          index: 0,
          finishReason: 'stop',
          message: {
            role: 'assistant',
            content: [
              {
                text: deepSeekResponse
              }
            ]
          }
        }
      ]
    };
  }
  
  return deepSeekResponse;
}

/**
 * Extracts text content from DeepSeek response
 */
export function extractTextFromDeepSeekResponse(response: any): string {
  // Try different possible locations for the text content
  if (response?.candidates?.[0]?.message?.content?.[0]?.text) {
    return response.candidates[0].message.content[0].text;
  }
  
  if (response?.candidates?.[0]?.message?.text) {
    return response.candidates[0].message.text;
  }
  
  if (response?.text) {
    return response.text;
  }
  
  if (typeof response === 'string') {
    return response;
  }
  
  return '';
}

/**
 * Parses JSON from DeepSeek response text
 */
export function parseJSONFromDeepSeekResponse(response: any): any {
  const text = extractTextFromDeepSeekResponse(response);
  
  if (!text) return null;
  
  try {
    // Handle JSON wrapped in markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Handle direct JSON
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      return JSON.parse(text.trim());
    }
    
    // Return as plain text if not JSON
    return { text: text };
  } catch (error) {
    console.warn('Failed to parse JSON from DeepSeek response:', error);
    return { text: text };
  }
}

/**
 * Enhanced generate function that handles DeepSeek responses properly
 */
export async function generateWithDeepSeekAdapter(
  ai: any,
  options: {
    prompt: string;
    model: any;
    output?: { schema: any };
    system?: string;
  }
): Promise<any> {
  const { prompt, model, output, system, ...otherOptions } = options;
  
  const fullPrompt = system ? `${system}\n\n${prompt}` : prompt;
  
  try {
    const result = await ai.generate({
      prompt: fullPrompt,
      model: model,
      ...otherOptions
    });
    
    // Get the raw response
    const rawResponse = result.response;
    
    // Extract and parse the text
    const parsedContent = parseJSONFromDeepSeekResponse(rawResponse);
    
    return {
      output: () => parsedContent,
      response: adaptDeepSeekResponse(rawResponse)
    };
  } catch (error) {
    console.error('DeepSeek generation error:', error);
    throw error;
  }
}

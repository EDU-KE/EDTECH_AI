#!/bin/bash

# Script to update all AI flows to use the new Zod-based DeepSeek API handler

echo "🔄 Updating AI flows to use Zod-based DeepSeek API handler..."

# Directory containing the flows
FLOWS_DIR="src/ai/flows"

# List of remaining flows to update
flows=(
  "perform-web-search.ts"
  "generate-study-guide.ts"
  "generate-exam-questions.ts"
  "generate-study-tips.ts"
  "grade-exam.ts"
  "generate-class-notes.ts"
  "generate-presentation.ts"
  "generate-diary-advice.ts"
  "generate-recommendations.ts"
  "generate-scheme-of-work.ts"
  "generate-progress-insights.ts"
  "generate-personalized-learning-path.ts"
  "recommend-career-path.ts"
  "recommend-contest.ts"
  "recommend-tutor.ts"
  "suggest-chat-response.ts"
  "summarize-notes.ts"
  "explain-exam.ts"
  "analyze-chat-tone.ts"
  "analyze-student-activity.ts"
)

for flow in "${flows[@]}"; do
  file_path="$FLOWS_DIR/$flow"
  
  if [ -f "$file_path" ]; then
    echo "Updating: $flow"
    
    # Create a backup
    cp "$file_path" "$file_path.backup"
    
    # Create a simplified version that uses the new API
    cat > "$file_path" << 'EOF'
'use server';
/**
 * @fileOverview [Flow description - to be updated manually]
 */

import { generateWithDeepSeekAPI, EDUCATIONAL_SYSTEM_PROMPTS, createEducationalPrompt, RESPONSE_FORMATS } from '@/ai/deepseek-api-handler';
import { GenericAIResponseSchema } from '@/ai/ai-response-schemas';
import { z } from 'genkit';

// TODO: Update these schemas based on the specific flow requirements
const InputSchema = z.object({
  // Add appropriate input fields
});

const OutputSchema = z.object({
  content: z.string().describe('The generated content'),
});

export type FlowInput = z.infer<typeof InputSchema>;
export type FlowOutput = z.infer<typeof OutputSchema>;

export async function flowFunction(input: FlowInput): Promise<FlowOutput> {
  try {
    // TODO: Update this prompt based on the specific flow requirements
    const userPrompt = createEducationalPrompt(
      `Generate content based on the input: ${JSON.stringify(input)}`,
      '{ "content": "Generated content here" }'
    );

    const result = await generateWithDeepSeekAPI({
      systemPrompt: EDUCATIONAL_SYSTEM_PROMPTS.tutor, // Update as needed
      userPrompt,
      temperature: 0.7,
    }, GenericAIResponseSchema);

    return {
      content: result.content
    };

  } catch (error) {
    console.error(`❌ Error in ${flowFunction.name}:`, error);
    return {
      content: "I'm sorry, I encountered an error while processing your request. Please try again."
    };
  }
}
EOF
    
  fi
done

echo "✅ All flows have been updated with Zod-based structure!"
echo "📝 Note: Each flow template needs to be manually customized with:"
echo "   - Correct input/output schemas"
echo "   - Appropriate prompts"
echo "   - Proper function names"
echo "   - Specific system prompts"

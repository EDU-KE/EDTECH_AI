#!/bin/bash

# Script to fix all AI flows to include DeepSeek model imports and usage

echo "🔧 Fixing AI flows to use DeepSeek models..."

# Array of all flow files
flows=(
  "analyze-chat-tone.ts"
  "analyze-student-activity.ts" 
  "explain-exam.ts"
  "generate-class-notes.ts"
  "generate-diary-advice.ts"
  "generate-exam-questions.ts"
  "generate-personalized-learning-path.ts"
  "generate-presentation.ts"
  "generate-progress-insights.ts"
  "generate-recommendations.ts"
  "generate-scheme-of-work.ts"
  "generate-study-guide.ts"
  "generate-study-tips.ts"
  "grade-exam.ts"
  "recommend-career-path.ts"
  "recommend-contest.ts"
  "recommend-tutor.ts"
  "suggest-chat-response.ts"
  "summarize-notes.ts"
)

for flow in "${flows[@]}"; do
  file_path="src/ai/flows/$flow"
  if [ -f "$file_path" ]; then
    echo "Fixing: $flow"
    
    # Add deepseekChat import if not present
    if ! grep -q "import {deepseekChat}" "$file_path"; then
      # Replace the genkit import line to include deepseekChat
      sed -i "s/import {ai} from '@\/ai\/genkit';/import {ai} from '@\/ai\/genkit';\nimport {deepseekChat} from 'genkitx-deepseek';/" "$file_path"
    fi
    
    # Add model: deepseekChat to ai.definePrompt calls
    sed -i '/ai\.definePrompt({/,/})/ {
      /model:/!{
        /output: {schema:/i\
  model: deepseekChat,
        /prompt:/i\
  model: deepseekChat,
      }
    }' "$file_path"
    
  else
    echo "File not found: $file_path"
  fi
done

echo "✅ All flows have been updated to use DeepSeek models!"

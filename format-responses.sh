#!/bin/bash

# Script to add response formatting to all AI flows

echo "🎨 Adding response formatting to AI flows..."

# Directory containing the flows
FLOWS_DIR="src/ai/flows"

# List of flows that need formatting
flows=(
  "analyze-chat-tone.ts"
  "analyze-student-activity.ts" 
  "analyze-subject.ts"
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
  "perform-web-search.ts"
  "recommend-career-path.ts"
  "recommend-contest.ts"
  "recommend-tutor.ts"
  "suggest-chat-response.ts"
  "summarize-notes.ts"
)

for flow in "${flows[@]}"; do
  file_path="$FLOWS_DIR/$flow"
  
  if [ -f "$file_path" ]; then
    echo "Formatting: $flow"
    
    # Add formatter import if not already present
    if ! grep -q "response-formatter" "$file_path"; then
      # Find the line with the last import and add our import after it
      sed -i '/^import.*genkit/a import {validateAndFormatResponse} from '"'"'@/ai/response-formatter'"'"';' "$file_path"
    fi
    
    # Update the flow return to use formatting (basic pattern matching)
    if grep -q "return output!" "$file_path"; then
      # Extract the output property name from the schema (basic approach)
      output_prop=$(grep -o "z\.string()\.describe('.*'" "$file_path" | head -1 | sed "s/.*describe('\([^']*\)'.*/\1/")
      
      # Replace simple return with formatted return
      sed -i 's/return output!/const result = output || {};\n    const formattedResult = {};\n    for (const [key, value] of Object.entries(result)) {\n      if (typeof value === '"'"'string'"'"') {\n        formattedResult[key] = validateAndFormatResponse(value, '"'"'general'"'"');\n      } else {\n        formattedResult[key] = value;\n      }\n    }\n    return formattedResult as any;/' "$file_path"
    fi
  fi
done

echo "✅ Response formatting has been added to all flows!"

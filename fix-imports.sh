#!/bin/bash

# Script to remove duplicate imports from AI flows

echo "🔧 Fixing duplicate imports in AI flows..."

# Directory containing the flows
FLOWS_DIR="src/ai/flows"

# List of flows that need fixing
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
  file_path="$FLOWS_DIR/$flow"
  
  if [ -f "$file_path" ]; then
    echo "Fixing: $flow"
    
    # Create a temporary file to store the fixed content
    temp_file=$(mktemp)
    
    # Remove duplicate validateAndFormatResponse imports
    awk '
    BEGIN { seen_formatter_import = 0 }
    /import.*validateAndFormatResponse.*response-formatter/ {
      if (seen_formatter_import == 0) {
        seen_formatter_import = 1
        print
      }
      next
    }
    { print }
    ' "$file_path" > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file_path"
  fi
done

echo "✅ All duplicate imports have been fixed!"


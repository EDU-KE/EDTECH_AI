#!/bin/bash

# Script to fix all AI flows to use ai.generate() directly

echo "🔧 Converting AI flows to use ai.generate() directly..."

# Directory containing the flows
FLOWS_DIR="src/ai/flows"

# List of flows to fix (excluding ones already manually fixed)
flows=(
  "provide-ai-tutoring.ts"
  "generate-lesson-plan.ts"
  "perform-web-search.ts"
)

for flow in "${flows[@]}"; do
  file_path="$FLOWS_DIR/$flow"
  
  if [ -f "$file_path" ]; then
    echo "Converting: $flow"
    
    # Create a backup
    cp "$file_path" "$file_path.backup"
    
    # For tutoring flow - update to use ai.generate directly
    if [[ "$flow" == "provide-ai-tutoring.ts" ]]; then
      # Replace the flow implementation
      sed -i '/const provideAiTutoringFlow = ai.defineFlow(/,/);$/c\
const provideAiTutoringFlow = ai.defineFlow(\
  {\
    name: '\''provideAiTutoringFlow'\'',\
    inputSchema: ProvideAiTutoringInputSchema,\
    outputSchema: ProvideAiTutoringOutputSchema,\
  },\
  async input => {\
    try {\
      const result = await ai.generate({\
        model: deepseekChat,\
        prompt: `You are an expert AI tutor specializing in ${input.subject}.\
${input.upcomingExams && input.upcomingExams.length > 0 ? `\
\
For context, here are upcoming exams:\
${input.upcomingExams.map(exam => `- ${exam.title} (Topic: ${exam.topic}, Duration: ${exam.duration})`).join('\n')}\
` : ''}\
A student has asked: "${input.question}"\
\
Provide a helpful and clear explanation. Be supportive and educational.`,\
        output: {\
          schema: ProvideAiTutoringOutputSchema\
        }\
      });\
\
      const output = result.output();\
      const formattedAnswer = formatJSONResponse(output?.answer || "I apologize, but I couldn'\''t generate a response. Please try rephrasing your question.");\
      \
      return {\
        answer: formattedAnswer\
      };\
    } catch (error) {\
      console.error('\''Error in provideAiTutoringFlow:'\'', error);\
      return {\
        answer: "I'\''m sorry, I encountered an error while processing your question. Please try again."\
      };\
    }\
  }\
);' "$file_path"
      
      # Remove the old prompt definition
      sed -i '/^const prompt = ai.definePrompt/,/^});$/d' "$file_path"
    fi
    
    # For lesson plan flow
    if [[ "$flow" == "generate-lesson-plan.ts" ]]; then
      sed -i '/const generateLessonPlanFlow = ai.defineFlow(/,/);$/c\
const generateLessonPlanFlow = ai.defineFlow(\
  {\
    name: '\''generateLessonPlanFlow'\'',\
    inputSchema: GenerateLessonPlanInputSchema,\
    outputSchema: GenerateLessonPlanOutputSchema,\
  },\
  async input => {\
    try {\
      const result = await ai.generate({\
        model: deepseekChat,\
        prompt: `Create a detailed lesson plan based on the following information.\
\
Subject: ${input.subject}\
Topic: ${input.topic}\
Lesson Duration: ${input.duration}\
Learning Objectives: ${input.objectives}\
\
The lesson plan should be well-structured, engaging, and suitable for the specified duration. Include introduction, activities, necessary materials, and a method for assessment. Format the output as clean Markdown.`,\
        output: {\
          schema: GenerateLessonPlanOutputSchema\
        }\
      });\
\
      const output = result.output();\
      const formattedLessonPlan = validateAndFormatResponse(output?.lessonPlan || "Unable to generate lesson plan.", '\''educational'\'');\
      \
      return {\
        lessonPlan: formattedLessonPlan\
      };\
    } catch (error) {\
      console.error('\''Error in generateLessonPlanFlow:'\'', error);\
      return {\
        lessonPlan: `# Lesson Plan: ${input.topic}\n\nSubject: ${input.subject}\nDuration: ${input.duration}\n\n## Learning Objectives\n${input.objectives}\n\n*Note: Detailed lesson plan generation encountered an error. Please try again.*`\
      };\
    }\
  }\
);' "$file_path"
      
      # Remove the old prompt definition
      sed -i '/^const prompt = ai.definePrompt/,/^});$/d' "$file_path"
    fi
    
  fi
done

echo "✅ All flows have been converted to use ai.generate() directly!"


'use server';
/**
 * @fileOverview An AI agent that suggests a response in a chat conversation.
 *
 * - suggestChatResponse - Analyzes a conversation and suggests a helpful reply.
 * - SuggestChatResponseInput - The input type for the function.
 * - SuggestChatResponseOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'peer']),
  content: z.string(),
});

const SuggestChatResponseInputSchema = z.object({
  messages: z.array(MessageSchema).describe("An array representing the chat history."),
  myRole: z.enum(['user', 'peer']).describe("The role of the person for whom the suggestion should be generated."),
});
export type SuggestChatResponseInput = z.infer<typeof SuggestChatResponseInputSchema>;

const SuggestChatResponseOutputSchema = z.object({
  suggestion: z.string().describe("A concise, helpful, and contextually appropriate chat response suggestion."),
});
export type SuggestChatResponseOutput = z.infer<typeof SuggestChatResponseOutputSchema>;

export async function suggestChatResponse(input: SuggestChatResponseInput): Promise<SuggestChatResponseOutput> {
  return suggestChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChatResponsePrompt',
  input: {schema: SuggestChatResponseInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: SuggestChatResponseOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an AI assistant designed to help learners communicate effectively and supportively.
  
  Your task is to analyze the following conversation and suggest a helpful, encouraging, and context-aware response for the '{{{myRole}}}'.
  
  Keep the suggestion brief (1-2 sentences). The tone should be positive and collaborative. For example, if the other person is stressed, suggest a supportive response. If they share good news, suggest a congratulatory one.

  Conversation History:
  {{#each messages}}
  **{{role}}**: {{content}}
  {{/each}}

  Generate a response for the **{{myRole}}** to send next.
  `,
});

const suggestChatResponseFlow = ai.defineFlow(
  {
    name: 'suggestChatResponseFlow',
    inputSchema: SuggestChatResponseInputSchema,
    outputSchema: SuggestChatResponseOutputSchema,
  },
  async (input) => {
    // Don't run for very short conversations
    if (input.messages.length < 1) {
        return {
            suggestion: "How are you doing?",
        };
    }
    const {output} = await prompt(input);
    const result = output || {};
    const formattedResult = {};
    for (const [key, value] of Object.entries(result)) {
      if (typeof value === 'string') {
        formattedResult[key] = validateAndFormatResponse(value, 'general');
      } else {
        formattedResult[key] = value;
      }
    }
    return formattedResult as any;;
  }
);

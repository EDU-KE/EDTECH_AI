
'use server';
/**
 * @fileOverview An AI agent that analyzes the tone of a chat conversation.
 *
 * - analyzeChatTone - Analyzes chat messages to determine the emotional tone.
 * - AnalyzeChatToneInput - The input type for the function.
 * - AnalyzeChatToneOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {validateAndFormatResponse} from '@/ai/response-formatter';
import {deepseekChat} from 'genkitx-deepseek';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'peer']),
  content: z.string(),
});

const AnalyzeChatToneInputSchema = z.object({
  messages: z.array(MessageSchema).describe("An array representing the chat history."),
});
export type AnalyzeChatToneInput = z.infer<typeof AnalyzeChatToneInputSchema>;

const AnalyzeChatToneOutputSchema = z.object({
  tone: z.string().describe("A single-word description of the overall emotional tone of the conversation (e.g., 'Positive', 'Anxious', 'Supportive', 'Neutral')."),
  insight: z.string().describe("A brief, actionable insight based on the conversation's tone. For example, if the tone is anxious, suggest talking to a tutor or breaking down study tasks."),
});
export type AnalyzeChatToneOutput = z.infer<typeof AnalyzeChatToneOutputSchema>;

export async function analyzeChatTone(input: AnalyzeChatToneInput): Promise<AnalyzeChatToneOutput> {
  return analyzeChatToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChatTonePrompt',
  input: {schema: AnalyzeChatToneInputSchema},
  model: deepseekChat,
  model: deepseekChat,
  output: {schema: AnalyzeChatToneOutputSchema},
  model: deepseekChat,
  model: deepseekChat,
  prompt: `You are an expert AI in emotional analysis and student psychology. Your task is to analyze a conversation between two learners and determine its overall tone.

  {{#if (lt messages.length 2)}}
  Your task is to return a neutral tone because the conversation is too short for a deep analysis.
  Set the tone to "Neutral".
  Set the insight to "Keep the conversation going to get a more detailed analysis.".
  {{else}}
  Analyze the following conversation:
  {{#each messages}}
  **{{role}}**: {{content}}
  {{/each}}

  Based on the entire conversation:
  1.  **Identify the Tone:** Determine the dominant emotional tone. Is it positive, negative, supportive, anxious, collaborative, or neutral? Choose the single best descriptor.
  2.  **Provide an Insight:** Write one brief, helpful sentence of insight. If the tone is negative or anxious, offer a constructive suggestion (e.g., "It seems like there's some stress around the exam. Maybe breaking down the topics into smaller chunks could help?"). If the tone is positive, provide encouragement (e.g., "It's great to see such a supportive and collaborative discussion!").
  {{/if}}
  `,
});

const analyzeChatToneFlow = ai.defineFlow(
  {
    name: 'analyzeChatToneFlow',
    inputSchema: AnalyzeChatToneInputSchema,
    outputSchema: AnalyzeChatToneOutputSchema,
  },
  async input => {
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

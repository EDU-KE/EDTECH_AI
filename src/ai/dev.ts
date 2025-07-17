
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/provide-ai-tutoring.ts';
import '@/ai/flows/generate-personalized-learning-path.ts';
import '@/ai/flows/generate-recommendations.ts';
import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/generate-lesson-plan.ts';
import '@/ai/flows/generate-scheme-of-work.ts';
import '@/ai/flows/generate-class-notes.ts';
import '@/ai/flows/generate-study-tips.ts';
import '@/ai/flows/generate-exam-questions.ts';
import '@/ai/flows/explain-exam.ts';
import '@/ai/flows/generate-progress-insights.ts';
import '@/ai/flows/analyze-student-activity.ts';
import '@/ai/flows/recommend-tutor.ts';
import '@/ai/flows/recommend-career-path.ts';
import '@/ai/flows/perform-web-search.ts';
import '@/ai/flows/generate-study-guide.ts';
import '@/ai/flows/analyze-subject.ts';
import '@/ai/flows/generate-diary-advice.ts';
import '@/ai/flows/recommend-contest.ts';
import '@/ai/flows/analyze-chat-tone.ts';
import '@/ai/flows/suggest-chat-response.ts';
import '@/ai/flows/grade-exam.ts';
import '@/ai/flows/generate-presentation.ts';
import '@/ai/flows/smart-notifications.ts';

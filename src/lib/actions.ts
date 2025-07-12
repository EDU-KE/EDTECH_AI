
"use server"

import { generatePersonalizedLearningPath } from "@/ai/flows/generate-personalized-learning-path"
import { provideAiTutoring } from "@/ai/flows/provide-ai-tutoring"
import { generateRecommendations, type GenerateRecommendationsOutput } from "@/ai/flows/generate-recommendations"
import { summarizeNotes } from "@/ai/flows/summarize-notes";
import { generateClassNotes } from "@/ai/flows/generate-class-notes";
import { generateLessonPlan } from "@/ai/flows/generate-lesson-plan";
import { generateSchemeOfWork } from "@/ai/flows/generate-scheme-of-work";
import { generateStudyTips } from "@/ai/flows/generate-study-tips";
import { generateExamQuestions, type GenerateExamQuestionsOutput } from "@/ai/flows/generate-exam-questions";
import { explainExam } from "@/ai/flows/explain-exam";
import { generateProgressInsights } from "@/ai/flows/generate-progress-insights";
import { analyzeStudentActivity } from "@/ai/flows/analyze-student-activity";
import { recommendTutor, type RecommendTutorOutput } from "@/ai/flows/recommend-tutor";
import { recommendCareerPath, type RecommendCareerPathOutput } from "@/ai/flows/recommend-career-path";
import { performWebSearch } from "@/ai/flows/perform-web-search";
import { generateStudyGuide, type GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { analyzeSubject } from "@/ai/flows/analyze-subject";
import { generateDiaryAdvice } from "@/ai/flows/generate-diary-advice";
import { recommendContest, type RecommendContestOutput } from "@/ai/flows/recommend-contest";
import { analyzeChatTone, type AnalyzeChatToneOutput } from "@/ai/flows/analyze-chat-tone";
import { suggestChatResponse, type SuggestChatResponseOutput } from "@/ai/flows/suggest-chat-response";
import { gradeExam, type GradeExamOutput } from "@/ai/flows/grade-exam";
import { generatePresentation, type GeneratePresentationOutput } from "@/ai/flows/generate-presentation";
import { z } from "zod"

const tutorSchema = z.object({
  subject: z.string(),
  question: z.string().min(1, "Please enter a question."),
})

export async function getTutorResponse(formData: FormData) {
  const validatedFields = tutorSchema.safeParse({
    subject: formData.get("subject"),
    question: formData.get("question"),
  })

  if (!validatedFields.success) {
    return { error: "Invalid input." }
  }

  try {
    const result = await provideAiTutoring(validatedFields.data)
    return { answer: result.answer }
  } catch (error) {
    console.error(error)
    return { error: "An error occurred while getting a response from the AI tutor." }
  }
}

const learningPathSchema = z.object({
  subject: z.string(),
  knowledgeLevel: z.string(),
  learningGoals: z.string().min(1, "Please enter your learning goals."),
})

export async function getLearningPath(formData: FormData) {
  const validatedFields = learningPathSchema.safeParse({
    subject: formData.get("subject"),
    knowledgeLevel: formData.get("knowledgeLevel"),
    learningGoals: formData.get("learningGoals"),
  })

  if (!validatedFields.success) {
    return { error: "Invalid input." }
  }

  try {
    const result = await generatePersonalizedLearningPath(validatedFields.data)
    return { learningPath: result.learningPath }
  } catch (error) {
    console.error(error)
    return { error: "An error occurred while generating the learning path." }
  }
}

const recommendationsSchema = z.object({
    subject: z.string(),
    topic: z.string().min(3, "Please enter a topic."),
});

export async function getRecommendations(formData: FormData): Promise<{ recommendations?: GenerateRecommendationsOutput['recommendations']; error?: string }> {
    const validatedFields = recommendationsSchema.safeParse({
        subject: formData.get("subject"),
        topic: formData.get("topic"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateRecommendations(validatedFields.data);
        return { recommendations: result.recommendations };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating recommendations." };
    }
}

const summarizerSchema = z.object({
    notes: z.string().min(20, "Please provide at least 20 characters of notes to summarize."),
});

export async function getSummary(formData: FormData) {
    const validatedFields = summarizerSchema.safeParse({
        notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await summarizeNotes(validatedFields.data);
        return { summary: result.summary };
    } catch (error)
        {
        console.error(error);
        return { error: "An error occurred while generating the summary." };
    }
}

const classNotesSchema = z.object({
    subject: z.string(),
    topic: z.string().min(3, "Please enter a topic."),
    bookContent: z.string().optional(),
});

export async function getClassNotes(formData: FormData) {
    const validatedFields = classNotesSchema.safeParse({
        subject: formData.get("subject"),
        topic: formData.get("topic"),
        bookContent: formData.get("bookContent") || undefined,
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateClassNotes(validatedFields.data);
        return { notes: result.notes };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating class notes." };
    }
}

const lessonPlanSchema = z.object({
    subject: z.string(),
    topic: z.string().min(3),
    duration: z.string().min(2),
    objectives: z.string().min(10),
});

export async function getLessonPlan(formData: FormData) {
    const validatedFields = lessonPlanSchema.safeParse({
        subject: formData.get("subject"),
        topic: formData.get("topic"),
        duration: formData.get("duration"),
        objectives: formData.get("objectives"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateLessonPlan(validatedFields.data);
        return { lessonPlan: result.lessonPlan };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating the lesson plan." };
    }
}

const schemeOfWorkSchema = z.object({
    subject: z.string(),
    gradeLevel: z.string().min(2),
    termDuration: z.string().min(2),
});

export async function getSchemeOfWork(formData: FormData) {
    const validatedFields = schemeOfWorkSchema.safeParse({
        subject: formData.get("subject"),
        gradeLevel: formData.get("gradeLevel"),
        termDuration: formData.get("termDuration"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateSchemeOfWork(validatedFields.data);
        return { schemeOfWork: result.schemeOfWork };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating the scheme of work." };
    }
}

const studyTipsSchema = z.object({
    subject: z.string(),
});

export async function getStudyTips(formData: FormData) {
    const validatedFields = studyTipsSchema.safeParse({
        subject: formData.get("subject"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateStudyTips(validatedFields.data);
        return { tips: result.tips };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating study tips." };
    }
}

const examQuestionsSchema = z.object({
    subject: z.string(),
    topic: z.string().min(3),
    numQuestions: z.coerce.number().int().min(1).max(10),
    questionTypes: z.array(z.string()),
});

export async function getGeneratedQuestions(formData: FormData): Promise<{ questions?: GenerateExamQuestionsOutput['questions']; error?: string }> {
    const questionTypes = formData.getAll("questionTypes");
    const validatedFields = examQuestionsSchema.safeParse({
        subject: formData.get("subject"),
        topic: formData.get("topic"),
        numQuestions: formData.get("numQuestions"),
        questionTypes,
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateExamQuestions(validatedFields.data);
        return { questions: result.questions };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating questions." };
    }
}

const explainExamSchema = z.object({
    subject: z.string(),
    examTitle: z.string(),
});

export async function getExamExplanation(formData: FormData) {
    const validatedFields = explainExamSchema.safeParse({
        subject: formData.get("subject"),
        examTitle: formData.get("examTitle"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await explainExam(validatedFields.data);
        return { explanation: result.explanation };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating the explanation." };
    }
}

const progressInsightsSchema = z.object({
    subject: z.string(),
    progressData: z.string().transform((str, ctx) => {
        try {
            return JSON.parse(str);
        } catch {
            ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
            return z.NEVER;
        }
    }),
});

export async function getProgressInsights(formData: FormData) {
    const validatedFields = progressInsightsSchema.safeParse({
        subject: formData.get("subject"),
        progressData: formData.get("progressData"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateProgressInsights(validatedFields.data);
        return { insights: result.insights };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating progress insights." };
    }
}

const activityAnalysisSchema = z.object({
    activities: z.string().transform((str, ctx) => {
        try {
            return JSON.parse(str);
        } catch {
            ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
            return z.NEVER;
        }
    }),
});

export async function getActivityAnalysis(formData: FormData) {
    const validatedFields = activityAnalysisSchema.safeParse({
        activities: formData.get("activities"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await analyzeStudentActivity({ activities: validatedFields.data.activities });
        return { analysis: result.analysis };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while analyzing activity." };
    }
}

const recommendTutorSchema = z.object({
  subject: z.string(),
});

export async function getTutorRecommendation(formData: FormData): Promise<{ data?: RecommendTutorOutput; error?: string }> {
  const validatedFields = recommendTutorSchema.safeParse({
    subject: formData.get("subject"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid input." };
  }

  try {
    const result = await recommendTutor(validatedFields.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: `An error occurred while recommending a tutor: ${error instanceof Error ? error.message : String(error)}` };
  }
}

const careerPathSchema = z.object({
  performanceData: z.string().transform((str, ctx) => {
    try {
        return JSON.parse(str);
    } catch {
        ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
        return z.NEVER;
    }
  }),
});

export async function getCareerPath(formData: FormData): Promise<{ path?: RecommendCareerPathOutput; error?: string }> {
    const validatedFields = careerPathSchema.safeParse({
        performanceData: formData.get("performanceData"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await recommendCareerPath(validatedFields.data.performanceData);
        return { path: result };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating your career path." };
    }
}

const webSearchSchema = z.object({
    query: z.string().min(1, "Please enter a search query."),
});

export async function getWebSearchResults(formData: FormData) {
    const validatedFields = webSearchSchema.safeParse({
        query: formData.get("query"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await performWebSearch(validatedFields.data);
        return { summary: result.summary };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while performing the search." };
    }
}

const studyGuideSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export async function getStudyGuide(formData: FormData): Promise<{ guide?: GenerateStudyGuideOutput; error?: string }> {
    const validatedFields = studyGuideSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateStudyGuide(validatedFields.data);
        return { guide: result };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating the study guide." };
    }
}

const subjectAnalysisSchema = z.object({
    subjectTitle: z.string(),
});

export async function getSubjectAnalysis(formData: FormData) {
    const validatedFields = subjectAnalysisSchema.safeParse({
        subjectTitle: formData.get("subjectTitle"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await analyzeSubject(validatedFields.data);
        return { analysis: result.analysis };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while analyzing the subject." };
    }
}


const diaryAdviceSchema = z.object({
    plan: z.string(),
});

export async function getDiaryAdvice(formData: FormData) {
    const validatedFields = diaryAdviceSchema.safeParse({
        plan: formData.get("plan"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input." };
    }

    try {
        const result = await generateDiaryAdvice(validatedFields.data);
        return { advice: result.advice };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating diary advice." };
    }
}

const jsonParser = (key: string) => z.string().transform((str, ctx) => {
    try {
        return JSON.parse(str);
    } catch {
        ctx.addIssue({ code: 'custom', message: `Invalid JSON in ${key}` });
        return z.NEVER;
    }
});

const contestRecommendationSchema = z.object({
    studentProfile: jsonParser('studentProfile'),
    contests: jsonParser('contests'),
});

export async function getContestRecommendation(formData: FormData): Promise<{ recommendation?: RecommendContestOutput; error?: string }> {
    const validatedFields = contestRecommendationSchema.safeParse({
        studentProfile: formData.get("studentProfile"),
        contests: formData.get("contests"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten());
        return { error: "Invalid input." };
    }

    try {
        const result = await recommendContest(validatedFields.data);
        return { recommendation: result };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating the contest recommendation." };
    }
}

const chatToneSchema = z.object({
    messages: jsonParser('messages'),
});

export async function getChatToneAnalysis(formData: FormData): Promise<{ analysis?: AnalyzeChatToneOutput; error?: string }> {
    const validatedFields = chatToneSchema.safeParse({
        messages: formData.get("messages"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten());
        return { error: "Invalid input for tone analysis." };
    }

    try {
        const result = await analyzeChatTone(validatedFields.data);
        return { analysis: result };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while analyzing the chat tone." };
    }
}

const suggestResponseSchema = z.object({
    messages: jsonParser('messages'),
    myRole: z.enum(['user', 'peer']),
});

export async function getSuggestedResponse(formData: FormData): Promise<{ suggestion?: SuggestChatResponseOutput; error?: string }> {
    const validatedFields = suggestResponseSchema.safeParse({
        messages: formData.get("messages"),
        myRole: 'user',
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten());
        return { error: "Invalid input for response suggestion." };
    }

    try {
        const result = await suggestChatResponse(validatedFields.data);
        return { suggestion: result };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while suggesting a response." };
    }
}

const gradeExamSchema = z.object({
    subject: z.string(),
    examTitle: z.string(),
});

export async function getGradeExam(formData: FormData): Promise<{ results?: GradeExamOutput; error?: string }> {
    const validatedFields = gradeExamSchema.safeParse({
        subject: formData.get("subject"),
        examTitle: formData.get("examTitle"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input for grading." };
    }

    try {
        const result = await gradeExam(validatedFields.data);
        return { results: result };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while grading the exam." };
    }
}

const presentationSchema = z.object({
    subject: z.string(),
    topic: z.string(),
    bookContent: z.string(),
});

export async function getPresentation(formData: FormData): Promise<{ presentation?: GeneratePresentationOutput; error?: string }> {
    const validatedFields = presentationSchema.safeParse({
        subject: formData.get("subject"),
        topic: formData.get("topic"),
        bookContent: formData.get("bookContent"),
    });
    
    if (!validatedFields.success) {
        return { error: "Invalid input for presentation generation." };
    }
    
    try {
        const result = await generatePresentation(validatedFields.data);
        return { presentation: result };
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while generating the presentation." };
    }
}

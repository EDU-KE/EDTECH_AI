

import { Calculator, Dna, Landmark, PenSquare, Users, LineChart, Lightbulb, FileQuestion, Activity, BookOpen, Trophy, Swords, UsersRound, Languages, FlaskConical, Atom, Globe, Paintbrush, Home, BookUser, Route, Library, BookMarked, type LucideIcon, Presentation } from "lucide-react";
import type { GeneratePresentationOutput } from "@/ai/flows/generate-presentation";


/**
 * Generates a random ISO-like ID (e.g., AB1234).
 * @returns A randomly generated ID string.
 */
function generateIsoId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let result = '';
  
  // Generate 2 random letters
  for (let i = 0; i < 2; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 4 random numbers
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return result;
}

export interface Subject {
    id: string;
    isoId: string;
    title: string;
    description: string;
    Icon: LucideIcon;
    imageUrl: string;
    imageHint: string;
    tag: string;
}

export const subjects: Subject[] = [
  {
    id: "math",
    isoId: generateIsoId(),
    title: "Mathematics",
    description: "Explore the world of numbers, from algebra to calculus.",
    Icon: Calculator,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "abstract math",
    tag: "Core Subject",
  },
  {
    id: "english",
    isoId: generateIsoId(),
    title: "English",
    description: "Master literature, grammar, and creative writing skills.",
    Icon: PenSquare,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "classic books",
    tag: "Language Arts",
  },
  {
    id: "kiswahili",
    isoId: generateIsoId(),
    title: "Kiswahili",
    description: "Jifunze lugha ya Kiswahili, fasihi na sarufi.",
    Icon: Languages,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "african patterns",
    tag: "Language Arts",
  },
  {
    id: "biology",
    isoId: generateIsoId(),
    title: "Biology",
    description: "Discover the principles of life and living organisms.",
    Icon: Dna,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "biology life",
    tag: "Science",
  },
  {
    id: "chemistry",
    isoId: generateIsoId(),
    title: "Chemistry",
    description: "Study the composition, structure, and properties of matter.",
    Icon: FlaskConical,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "chemistry lab",
    tag: "Science",
  },
  {
    id: "physics",
    isoId: generateIsoId(),
    title: "Physics",
    description: "Understand the fundamental principles of the universe.",
    Icon: Atom,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "physics atom",
    tag: "Science",
  },
  {
    id: "geography",
    isoId: generateIsoId(),
    title: "Geography",
    description: "Explore the lands, features, inhabitants, and phenomena of Earth.",
    Icon: Globe,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "world map",
    tag: "Humanities",
  },
  {
    id: "history",
    isoId: generateIsoId(),
    title: "History",
    description: "Journey through time and learn about past civilizations.",
    Icon: Landmark,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "historical artifacts",
    tag: "Humanities",
  },
  {
    id: "social-studies",
    isoId: generateIsoId(),
    title: "Social Studies",
    description: "Learn about human society, relationships, and culture.",
    Icon: Users,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "community people",
    tag: "Humanities",
  },
  {
    id: "creative-arts",
    isoId: generateIsoId(),
    title: "Creative Arts",
    description: "Unleash your creativity through drawing, painting, and design.",
    Icon: Paintbrush,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "art supplies",
    tag: "Arts",
  },
  {
    id: "home-science",
    isoId: generateIsoId(),
    title: "Home Science",
    description: "Gain practical skills in home management, nutrition, and textiles.",
    Icon: Home,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "cozy kitchen",
    tag: "Life Skills",
  },
];


export const getSubjectById = (id: string) => {
    return subjects.find(subject => subject.id === id);
}

export const students = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://placehold.co/100x100.png', hint: 'student avatar' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatar: 'https://placehold.co/100x100.png', hint: 'student avatar' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'https://placehold.co/100x100.png', hint: 'student avatar' },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', avatar: 'https://placehold.co/100x100.png', hint: 'student avatar' },
  { id: '5', name: 'Ethan Davis', email: 'ethan@example.com', avatar: 'https://placehold.co/100x100.png', hint: 'student avatar' },
]

export const progressData = {
  math: [
    { month: "Jan", progress: 60 },
    { month: "Feb", progress: 65 },
    { month: "Mar", progress: 70 },
    { month: "Apr", progress: 75 },
    { month: "May", progress: 80 },
    { month: "Jun", progress: 85 },
  ],
  english: [
    { month: "Jan", progress: 80 },
    { month: "Feb", progress: 82 },
    { month: "Mar", progress: 85 },
    { month: "Apr", progress: 88 },
    { month: "May", progress: 90 },
    { month: "Jun", progress: 95 },
  ],
  kiswahili: [
    { month: "Jan", progress: 50 },
    { month: "Feb", progress: 55 },
    { month: "Mar", progress: 58 },
    { month: "Apr", progress: 62 },
    { month: "May", progress: 65 },
    { month: "Jun", progress: 70 },
  ],
  biology: [
    { month: "Jan", progress: 70 },
    { month: "Feb", progress: 72 },
    { month: "Mar", progress: 68 },
    { month: "Apr", progress: 75 },
    { month: "May", progress: 78 },
    { month: "Jun", progress: 80 },
  ],
  chemistry: [
    { month: "Jan", progress: 62 },
    { month: "Feb", progress: 66 },
    { month: "Mar", progress: 70 },
    { month: "Apr", progress: 71 },
    { month: "May", progress: 75 },
    { month: "Jun", progress: 78 },
  ],
  physics: [
    { month: "Jan", progress: 68 },
    { month: "Feb", progress: 71 },
    { month: "Mar", progress: 75 },
    { month: "Apr", progress: 78 },
    { month: "May", progress: 82 },
    { month: "Jun", progress: 85 },
  ],
  geography: [
    { month: "Jan", progress: 75 },
    { month: "Feb", progress: 78 },
    { month: "Mar", progress: 80 },
    { month: "Apr", progress: 82 },
    { month: "May", progress: 85 },
    { month: "Jun", progress: 88 },
  ],
  history: [
    { month: "Jan", progress: 78 },
    { month: "Feb", progress: 80 },
    { month: "Mar", progress: 81 },
    { month: "Apr", progress: 84 },
    { month: "May", progress: 87 },
    { month: "Jun", progress: 90 },
  ],
  "social-studies": [
    { month: "Jan", progress: 72 },
    { month: "Feb", progress: 75 },
    { month: "Mar", progress: 78 },
    { month: "Apr", progress: 80 },
    { month: "May", progress: 82 },
    { month: "Jun", progress: 85 },
  ],
  "creative-arts": [
    { month: "Jan", progress: 85 },
    { month: "Feb", progress: 86 },
    { month: "Mar", progress: 88 },
    { month: "Apr", progress: 90 },
    { month: "May", progress: 92 },
    { month: "Jun", progress: 94 },
  ],
  "home-science": [
    { month: "Jan", progress: 80 },
    { month: "Feb", progress: 82 },
    { month: "Mar", progress: 84 },
    { month: "Apr", progress: 86 },
    { month: "May", progress: 88 },
    { month: "Jun", progress: 90 },
  ],
};

export const chartConfig = {
  progress: {
    label: "Progress (%)",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig

export const exams = [
    { id: 'm1', isoId: generateIsoId(), subject: 'Mathematics', topic: 'Algebra', title: 'Algebra I Final', duration: '90 min' },
    { id: 'm2', isoId: generateIsoId(), subject: 'Mathematics', topic: 'Geometry', title: 'Geometry Mid-term', duration: '60 min' },
    { id: 's1', isoId: generateIsoId(), subject: 'Biology', topic: 'Biology', title: 'Biology Basics Quiz', duration: '30 min' },
    { id: 's2', isoId: generateIsoId(), subject: 'Chemistry', topic: 'Chemistry', title: 'Periodic Table Test', duration: '45 min' },
    { id: 'h1', isoId: generateIsoId(), subject: 'History', topic: '20th Century', title: 'World War II Exam', duration: '75 min' },
    { id: 'e1', isoId: generateIsoId(), subject: 'English', topic: 'Literature', title: "Shakespeare's Hamlet Analysis", duration: '120 min' },
];

export const getExamsBySubject = (subjectTitle: string) => {
    return exams.filter(exam => exam.subject === subjectTitle);
}

export const dashboardCards = [
    {
        id: "subjects",
        title: "Manage Subjects",
        description: "Enroll in new subjects and manage your curriculum.",
        href: "/subjects/my-subjects",
        Icon: BookUser,
    },
    {
        id: "exams",
        title: "Exams & Revision",
        description: "Access exams, practice tests, and AI revision tools.",
        href: "/exams",
        Icon: FileQuestion,
    },
    {
        id: "learning-path",
        title: "AI Learning Path",
        description: "Generate a personalized study plan for any subject.",
        href: "/learning-path",
        Icon: BookOpen,
    },
    {
        id: "career-path",
        title: "AI Career Path",
        description: "Get AI-driven career recommendations based on your progress.",
        href: "/career-path",
        Icon: Route,
    },
    {
        id: "tutors",
        title: "Online Tutors",
        description: "Connect with expert tutors for one-on-one help.",
        href: "/tutors/online",
        Icon: UsersRound,
    },
     {
        id: "diary",
        title: "Digital Diary",
        description: "Plan your activities and get AI-powered advice.",
        href: "/diary",
        Icon: BookMarked,
    },
    {
        id: "leaderboard",
        title: "Leaderboard",
        description: "See how you rank against other learners on the platform.",
        href: "/leaderboard",
        Icon: Trophy,
    },
    {
        id: "progress",
        title: "Progress Records",
        description: "Track academic performance across all subjects.",
        href: "/progress",
        Icon: LineChart,
    },
]

export interface MockNotification {
    id: number;
    title: string;
    description: string;
}

export const mockNotifications: MockNotification[] = [
    { id: 1, title: "Exam Reminder", description: "Your Math exam is tomorrow." },
    { id: 2, title: "New Resource", description: "AI has recommended a new article for Biology." },
    { id: 3, title: "Progress Update", description: "You've reached a 75% progress score in Science." },
];

export const studentActivities = [
    { id: 1, description: "Completed 'Algebra I Final' practice quiz.", timestamp: "2 hours ago", subject: "Mathematics" },
    { id: 2, description: "Watched video 'The Cell Cycle'.", timestamp: "5 hours ago", subject: "Biology" },
    { id: 3, description: "Generated notes for 'The Causes of World War I'.", timestamp: "1 day ago", subject: "History" },
    { id: 4, asked: "Asked AI Tutor about Shakespeare's sonnets.", timestamp: "2 days ago", subject: "English" },
    { id: 5, description: "Summarized notes on 'Chemical Bonds'.", timestamp: "3 days ago", subject: "Chemistry" },
];

export interface OnlineTutor {
    id: string;
    name: string;
    specialty: string;
    subjects: string[];
    rating: number;
    reviews: number;
    avatar: string;
    hint: string;
    contact: string;
    experience: string;
    education: string;
    hourlyRate: number;
    availability: string;
    language: string[];
    bio: string;
    achievements: string[];
    isAvailable: boolean;
    responseTime: string;
    totalStudents: number;
}

export const onlineTutors: OnlineTutor[] = [
    { 
        id: 't1', 
        name: 'Dr. Evelyn Reed', 
        specialty: 'Mathematics', 
        subjects: ['Mathematics', 'Statistics', 'Calculus', 'Algebra'],
        rating: 4.9, 
        reviews: 234,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'female professor', 
        contact: '#',
        experience: '8 years',
        education: 'PhD in Mathematics, MIT',
        hourlyRate: 45,
        availability: 'Mon-Fri 9AM-5PM',
        language: ['English', 'Spanish'],
        bio: 'Passionate mathematics educator with expertise in advanced calculus and statistics. I help students build strong foundations and tackle complex mathematical concepts with confidence.',
        achievements: ['Best Online Tutor 2023', 'PhD in Mathematics', '500+ Students Taught'],
        isAvailable: true,
        responseTime: '< 1 hour',
        totalStudents: 456
    },
    { 
        id: 't2', 
        name: 'Mr. Samuel Chen', 
        specialty: 'Biology', 
        subjects: ['Biology', 'Biochemistry', 'Molecular Biology', 'Genetics'],
        rating: 4.8, 
        reviews: 189,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'male teacher', 
        contact: '#',
        experience: '6 years',
        education: 'MSc in Biology, Stanford University',
        hourlyRate: 40,
        availability: 'Tue-Sat 2PM-8PM',
        language: ['English', 'Mandarin'],
        bio: 'Experienced biology tutor specializing in molecular biology and genetics. I make complex biological processes easy to understand through interactive teaching methods.',
        achievements: ['Top Rated Tutor', 'Published Researcher', 'Excellence in Teaching Award'],
        isAvailable: true,
        responseTime: '< 2 hours',
        totalStudents: 321
    },
    { 
        id: 't3', 
        name: 'Ms. Clara Oswald', 
        specialty: 'English', 
        subjects: ['English Literature', 'Creative Writing', 'Grammar', 'Essay Writing'],
        rating: 4.9, 
        reviews: 312,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'female teacher', 
        contact: '#',
        experience: '7 years',
        education: 'MA in English Literature, Oxford University',
        hourlyRate: 35,
        availability: 'Mon-Sun 10AM-6PM',
        language: ['English', 'French'],
        bio: 'Creative and engaging English tutor with a passion for literature and writing. I help students develop strong communication skills and literary analysis abilities.',
        achievements: ['Oxford Graduate', 'Published Author', 'Literary Award Winner'],
        isAvailable: false,
        responseTime: '< 3 hours',
        totalStudents: 567
    },
    { 
        id: 't4', 
        name: 'Dr. Kenji Tanaka', 
        specialty: 'History', 
        subjects: ['World History', 'Asian History', 'Political Science', 'Cultural Studies'],
        rating: 4.7, 
        reviews: 156,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'male professor', 
        contact: '#',
        experience: '10 years',
        education: 'PhD in History, Tokyo University',
        hourlyRate: 42,
        availability: 'Wed-Sun 1PM-7PM',
        language: ['English', 'Japanese', 'Korean'],
        bio: 'Historian with deep expertise in Asian history and political science. I bring historical events to life through engaging storytelling and critical analysis.',
        achievements: ['Historical Research Award', 'International Conference Speaker', 'Cultural Heritage Expert'],
        isAvailable: true,
        responseTime: '< 4 hours',
        totalStudents: 289
    },
    { 
        id: 't5', 
        name: 'Prof. Anya Sharma', 
        specialty: 'Chemistry', 
        subjects: ['Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Biochemistry'],
        rating: 4.9, 
        reviews: 201,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'female scientist', 
        contact: '#',
        experience: '9 years',
        education: 'PhD in Chemistry, Cambridge University',
        hourlyRate: 48,
        availability: 'Mon-Fri 8AM-4PM',
        language: ['English', 'Hindi', 'German'],
        bio: 'Renowned chemistry professor with expertise in organic and physical chemistry. I simplify complex chemical concepts and make learning chemistry enjoyable and accessible.',
        achievements: ['Chemistry Excellence Award', 'Research Publications', 'Innovation in Teaching'],
        isAvailable: true,
        responseTime: '< 1 hour',
        totalStudents: 423
    },
    { 
        id: 't6', 
        name: 'Mr. Ben Carter', 
        specialty: 'Physics', 
        subjects: ['Physics', 'Quantum Physics', 'Mechanical Engineering', 'Astronomy'],
        rating: 4.6, 
        reviews: 143,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'friendly man', 
        contact: '#',
        experience: '5 years',
        education: 'MSc in Physics, Caltech',
        hourlyRate: 38,
        availability: 'Tue-Sat 11AM-7PM',
        language: ['English'],
        bio: 'Physics enthusiast with a knack for explaining complex theories in simple terms. I help students understand the fundamental principles of physics through practical examples.',
        achievements: ['Young Educator Award', 'Physics Olympiad Coach', 'STEM Advocate'],
        isAvailable: false,
        responseTime: '< 2 hours',
        totalStudents: 234
    },
    { 
        id: 't7', 
        name: 'Dr. Maria Rodriguez', 
        specialty: 'Computer Science', 
        subjects: ['Programming', 'Data Science', 'Machine Learning', 'Web Development'],
        rating: 4.8, 
        reviews: 278,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'female programmer', 
        contact: '#',
        experience: '7 years',
        education: 'PhD in Computer Science, UC Berkeley',
        hourlyRate: 50,
        availability: 'Mon-Wed 3PM-9PM',
        language: ['English', 'Spanish', 'Portuguese'],
        bio: 'Tech industry veteran turned educator. I specialize in programming, data science, and machine learning, helping students transition from beginners to proficient developers.',
        achievements: ['Google Developer Expert', 'AI Research Pioneer', 'Tech Educator of the Year'],
        isAvailable: true,
        responseTime: '< 1 hour',
        totalStudents: 512
    },
    { 
        id: 't8', 
        name: 'Mr. David Thompson', 
        specialty: 'Economics', 
        subjects: ['Economics', 'Business Studies', 'Finance', 'Statistics'],
        rating: 4.7, 
        reviews: 167,
        avatar: 'https://placehold.co/100x100.png', 
        hint: 'male business teacher', 
        contact: '#',
        experience: '6 years',
        education: 'MBA in Finance, Harvard Business School',
        hourlyRate: 44,
        availability: 'Thu-Mon 12PM-8PM',
        language: ['English', 'French'],
        bio: 'Business professional with extensive experience in economics and finance. I help students understand market dynamics and economic principles through real-world applications.',
        achievements: ['Harvard MBA', 'Wall Street Experience', 'Business Mentor Award'],
        isAvailable: true,
        responseTime: '< 3 hours',
        totalStudents: 345
    }
];

export const leaderboardData = [
  { 
    rank: 1, 
    name: 'Diana Miller', 
    points: 12580, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 12',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    streak: 28,
    level: 'Expert',
    badges: ['Math Genius', 'Perfect Attendance', 'Quick Learner']
  },
  { 
    rank: 2, 
    name: 'Ethan Davis', 
    points: 11950, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 11',
    subjects: ['Computer Science', 'Mathematics', 'English'],
    streak: 22,
    level: 'Advanced',
    badges: ['Code Master', 'Problem Solver']
  },
  { 
    rank: 3, 
    name: 'Alice Johnson', 
    points: 11200, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 12',
    subjects: ['Biology', 'Chemistry', 'Mathematics'],
    streak: 19,
    level: 'Advanced',
    badges: ['Science Star', 'Consistent Performer']
  },
  { 
    rank: 4, 
    name: 'Charlie Brown', 
    points: 10540, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 10',
    subjects: ['English', 'History', 'Geography'],
    streak: 15,
    level: 'Intermediate',
    badges: ['Literature Lover', 'History Buff']
  },
  { 
    rank: 5, 
    name: 'Bob Williams', 
    points: 9870, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 11',
    subjects: ['Physics', 'Mathematics', 'Computer Science'],
    streak: 12,
    level: 'Intermediate',
    badges: ['Tech Enthusiast']
  },
  { 
    rank: 6, 
    name: 'Frank White', 
    points: 9500, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 9',
    subjects: ['Mathematics', 'Science', 'English'],
    streak: 11,
    level: 'Intermediate',
    badges: ['Rising Star', 'Dedicated Student']
  },
  { 
    rank: 7, 
    name: 'Grace Green', 
    points: 8900, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 10',
    subjects: ['Art', 'English', 'History'],
    streak: 8,
    level: 'Beginner',
    badges: ['Creative Mind', 'Art Champion']
  },
  { 
    rank: 8, 
    name: 'Sarah Chen', 
    points: 8650, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 11',
    subjects: ['Chemistry', 'Biology', 'Mathematics'],
    streak: 14,
    level: 'Intermediate',
    badges: ['Lab Expert']
  },
  { 
    rank: 9, 
    name: 'Michael Torres', 
    points: 8320, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 9',
    subjects: ['Geography', 'History', 'English'],
    streak: 9,
    level: 'Beginner',
    badges: ['Explorer', 'Curious Learner']
  },
  { 
    rank: 10, 
    name: 'Emma Rodriguez', 
    points: 7980, 
    avatar: 'https://placehold.co/100x100.png', 
    hint: 'student avatar',
    grade: 'Grade 10',
    subjects: ['Music', 'English', 'French'],
    streak: 7,
    level: 'Beginner',
    badges: ['Music Maestro', 'Language Learner']
  }
];

export interface Contest {
    id: string;
    title: string;
    description: string;
    date: string;
    prize: string;
    imageUrl: string;
    imageHint: string;
}

export const contestsData: Contest[] = [
    { id: 'c1', title: 'Math Olympiad', description: 'A challenging competition for math enthusiasts. Solve complex problems and prove your skills.', date: 'July 30, 2024', prize: '$500', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'math contest' },
    { id: 'c2', title: 'Science Fair', description: 'Showcase your innovative science projects and experiments. Open to all fields of science.', date: 'August 15, 2024', prize: 'Trophy + Lab Kit', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'science project' },
    { id: 'c3', title: 'History Essay Contest', description: 'Write a compelling essay on a pivotal historical event. Judged on research, analysis, and writing.', date: 'September 1, 2024', prize: '$300 Book Voucher', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'historical documents' },
];

// Mock data for student performance - in a real app, this would come from a database.
export const studentPerformance = {
    strongestSubjects: ["Mathematics", "Physics"],
    weakestSubjects: ["English"],
    interests: ["Technology", "Problem Solving", "Science Fiction"],
    recentScores: {
        math: 92,
        physics: 88,
        english: 75,
    }
};

export interface LibraryBook {
    id: string;
    isoId?: string;
    title: string;
    author: string;
    subject: string;
    category: 'Subject Textbooks' | 'Reference' | 'Story Book';
    imageUrl: string;
    imageHint: string;
    previewContent: string;
}

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Proin sed quam et quam qiam sobpro quamet.\\n\\nDonec porta diam eu massa. Quisque diam lorem, interdum vitae, dapibus ac, scelerisque vitae, pede. Donec eget tellus non erat lacinia fermentum. Donec in velit vel ipsum auctor pulvinar. Vestibulum iaculis lacinia est. Proin dictum elementum velit. Fusce euismod consequat ante. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque sed dolor. Aliquam congue fermentum nisl. Mauris accumsan nulla vel diam. Sed in lacus ut enim adipiscing aliquet. Nulla venenatis. In pede mi, aliquet sit amet, euismod in, auctor ut, ligula. Aliquam dapibus tincidunt metus. Praesent justo dolor, lobortis quis, lobortis dignissim, pulvinar ac, lorem. Vestibulum sed ante. Donec sagittis euismod purus. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.";

export const libraryBooks: LibraryBook[] = [
    { id: 'b1', isoId: generateIsoId(), title: 'Algebra & Trigonometry', author: 'Paul A. Foerster', subject: 'Mathematics', category: 'Subject Textbooks', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'math textbook', previewContent: loremIpsum },
    { id: 'b2', isoId: generateIsoId(), title: 'Biology: A Global Approach', author: 'Campbell et al.', subject: 'Biology', category: 'Subject Textbooks', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'biology textbook', previewContent: loremIpsum },
    { id: 'b3', title: 'The Elements of Style', author: 'Strunk & White', subject: 'English', category: 'Reference', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'writing guide', previewContent: loremIpsum },
    { id: 'b4', title: 'To Kill a Mockingbird', author: 'Harper Lee', subject: 'English', category: 'Story Book', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'classic novel', previewContent: loremIpsum },
    { id: 'b5', title: 'A Brief History of Time', author: 'Stephen Hawking', subject: 'Physics', category: 'Reference', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'science book', previewContent: loremIpsum },
    { id: 'b6', isoId: generateIsoId(), title: 'Organic Chemistry', author: 'Paula Yurkanis Bruice', subject: 'Chemistry', category: 'Subject Textbooks', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'chemistry textbook', previewContent: loremIpsum },
    { id: 'b7', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', subject: 'History', category: 'Reference', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'history book', previewContent: loremIpsum },
    { id: 'b8', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', subject: 'English', category: 'Story Book', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'classic literature', previewContent: loremIpsum },
    { id: 'b9', isoId: generateIsoId(), title: 'Introduction to Physical Geography', author: 'Alan H. Strahler', subject: 'Geography', category: 'Subject Textbooks', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'geography textbook', previewContent: loremIpsum },
    { id: 'b10', isoId: generateIsoId(), title: 'Sociology: A Brief Introduction', author: 'Richard T. Schaefer', subject: 'Social Studies', category: 'Subject Textbooks', imageUrl: 'https://placehold.co/400x600.png', imageHint: 'sociology textbook', previewContent: loremIpsum },
];

export interface CertifiedMaterial {
    isoId: string;
    title: string;
    description: string;
    grade: number;
    type: 'Book' | 'Curriculum Design' | 'Syllabus';
}

export const certifiedMaterials: CertifiedMaterial[] = [
    { isoId: generateIsoId(), title: 'Grade 1 Curriculum Design', description: 'Official KICD curriculum design for all Grade 1 subjects.', grade: 1, type: 'Curriculum Design' },
    { isoId: generateIsoId(), title: 'Start-Up English Grade 1', description: 'KICD-approved textbook for Grade 1 English.', grade: 1, type: 'Book' },
    { isoId: generateIsoId(), title: 'Grade 2 Curriculum Design', description: 'Official KICD curriculum design for all Grade 2 subjects.', grade: 2, type: 'Curriculum Design' },
    { isoId: generateIsoId(), title: 'Start-Up Mathematics Grade 2', description: 'KICD-approved textbook for Grade 2 Mathematics.', grade: 2, type: 'Book' },
    { isoId: generateIsoId(), title: 'Grade 3 Science Syllabus', description: 'The official syllabus for Grade 3 Science.', grade: 3, type: 'Syllabus' },
];

export const getMaterialsByGrade = () => {
    return certifiedMaterials.reduce((acc, material) => {
        const grade = material.grade;
        if (!acc[grade]) {
            acc[grade] = [];
        }
        acc[grade].push(material);
        return acc;
    }, {} as Record<number, CertifiedMaterial[]>);
};


// We need a type that matches the output of the generate-presentation flow
export type SavedClassSession = Omit<GeneratePresentationOutput, "isoId"> & { 
    id: string;
    isoId: string;
    subject: string;
    grade: string;
};

export const savedClassSessions: SavedClassSession[] = [
    {
        id: "session1",
        isoId: "CLS-" + generateIsoId(),
        subject: "Biology",
        grade: "Grade 10",
        title: "Introduction to Photosynthesis",
        slides: [
            { title: "What is Photosynthesis?", content: ["The process plants use to convert light into food.", "Occurs in chloroplasts.", "Requires sunlight, water, and CO2."] },
            { title: "The Chemical Equation", content: ["6CO2 + 6H2O → C6H12O6 + 6O2", "Carbon Dioxide + Water → Glucose + Oxygen"] },
            { title: "Two Stages", content: ["1. Light-Dependent Reactions", "2. Calvin Cycle (Light-Independent)"] },
        ],
        questions: [
            { questionText: "What are the three main ingredients for photosynthesis?", answer: "Sunlight, water, and carbon dioxide." },
            { questionText: "What are the two main products of photosynthesis?", answer: "Glucose (sugar/food) and oxygen." },
        ]
    },
    {
        id: "session2",
        isoId: "CLS-" + generateIsoId(),
        subject: "History",
        grade: "Grade 11",
        title: "Causes of World War I",
        slides: [
            { title: "The M.A.I.N. Causes", content: ["Militarism", "Alliances", "Imperialism", "Nationalism"] },
            { title: "The Spark", content: ["Assassination of Archduke Franz Ferdinand of Austria-Hungary.", "June 28, 1914."] },
        ],
        questions: [
            { questionText: "What does the 'A' in the M.A.I.N. causes stand for?", answer: "Alliances" },
        ]
    },
    {
        id: "session3",
        isoId: "CLS-" + generateIsoId(),
        subject: "Biology",
        grade: "Grade 10",
        title: "The Human Digestive System",
        slides: [
            { title: "Overview", content: ["A group of organs working together to convert food into energy.", "Key organs: Mouth, Esophagus, Stomach, Intestines."] },
            { title: "The Stomach", content: ["Mixes food with digestive juices.", "Breaks down proteins."] },
        ],
        questions: [
            { questionText: "Name two key organs in the digestive system.", answer: "Stomach, Intestines (or others from the slide)." },
        ]
    }
];


"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  X, 
  Minimize2, 
  Maximize2, 
  MessageCircle, 
  ExternalLink, 
  BookOpen,
  FileQuestion,
  Users,
  BrainCircuit,
  Library,
  BarChart3,
  Settings,
  Home,
  Sparkles,
  Navigation,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from "lucide-react";

interface SystemComponent {
  name: string;
  url: string;
  description: string;
  icon: any;
  category: string;
}

interface AIHelpResponse {
  guidance: string;
  relevantComponents: SystemComponent[];
  quickActions: string[];
}

const systemComponents: SystemComponent[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
    description: "Overview of your learning progress and quick access to all features",
    icon: Home,
    category: "main"
  },
  {
    name: "Subjects",
    url: "/subjects/my-subjects",
    description: "Manage your enrolled subjects and view subject-specific content",
    icon: BookOpen,
    category: "learning"
  },
  {
    name: "Exams & Revision",
    url: "/exams",
    description: "Take practice exams, generate custom questions, and access revision tools",
    icon: FileQuestion,
    category: "assessment"
  },
  {
    name: "AI Tutor",
    url: "/tutor",
    description: "Get personalized AI tutoring and ask questions about any subject",
    icon: BrainCircuit,
    category: "ai"
  },
  {
    name: "Learning Tools",
    url: "/learning-tools",
    description: "Access study planners, progress trackers, and interactive learning resources",
    icon: Library,
    category: "tools"
  },
  {
    name: "Learning Path",
    url: "/learning-path",
    description: "Generate personalized AI-powered study plans for any subject",
    icon: Navigation,
    category: "ai"
  },
  {
    name: "Class Notes",
    url: "/class",
    description: "Access AI-generated class notes and presentations",
    icon: Users,
    category: "learning"
  },
  {
    name: "Progress Tracking",
    url: "/progress",
    description: "Monitor your learning progress across all subjects",
    icon: BarChart3,
    category: "analytics"
  }
];

const generateAIResponse = (currentPath: string): AIHelpResponse => {
  const currentPage = systemComponents.find(comp => comp.url === currentPath);
  
  // Context-aware guidance based on current page
  const getContextualGuidance = (): string => {
    // Handle dynamic routes
    if (currentPath.startsWith("/exams/") && currentPath !== "/exams") {
      return "You're taking an exam! 📝 Use the navigation controls to move between questions, track your progress with the progress bar, and submit when you're ready. The timer shows your remaining time, and you can navigate to any question using the numbered buttons.";
    }
    
    if (currentPath.startsWith("/subjects/") && currentPath !== "/subjects/my-subjects") {
      return "You're viewing a specific subject! 📚 Here you can access subject-specific resources, view your progress, take practice exams, and get AI-powered study recommendations. Use the tabs to navigate between overview, resources, and exams.";
    }
    
    switch (currentPath) {
      case "/dashboard":
        return "Welcome to your learning dashboard! 🎯 This is your command center where you can see your progress overview, quick access to subjects, and upcoming exams. From here, you can navigate to any part of the system using the cards below or the navigation menu.";
      
      case "/exams":
        return "You're in the Exams & Revision section! 📝 Here you can browse available exams by subject, take practice tests, or use the AI Question Generator to create custom quizzes. Click on any exam title to start taking it, or use the 'Take Exam' button for a more prominent call-to-action.";
      
      case "/subjects/my-subjects":
        return "This is your Subjects hub! 📚 Here you can view all your enrolled subjects, access subject-specific resources, and see your progress in each area. Click on any subject to dive deeper into its content, exams, and AI-powered recommendations.";
      
      case "/tutor":
        return "Welcome to your AI Tutor! 🤖 This is where you can have real-time conversations with AI about any subject. Ask questions, get explanations, request examples, or seek help with homework. The AI tutor adapts to your learning level and provides personalized assistance.";
      
      case "/learning-tools":
        return "You're in the Learning Tools section! 🛠️ This area provides various tools to enhance your learning experience including study planners, progress trackers, interactive quizzes, and resource libraries. Use these tools to organize your study sessions and track your improvement.";
      
      case "/learning-path":
        return "This is the AI Learning Path generator! 🗺️ Here you can create personalized study plans tailored to your goals and learning pace. The AI analyzes your current knowledge and creates a structured learning journey with milestones and recommendations.";
      
      case "/class":
        return "Welcome to Class Notes! 📖 This section provides access to AI-generated class notes, presentations, and study materials. You can browse by subject and topic, or generate new notes for specific topics using AI assistance.";
      
      case "/progress":
        return "This is your Progress Tracking area! 📊 Here you can monitor your learning progress across all subjects, view detailed analytics, and identify areas for improvement. Use the charts and metrics to track your growth over time.";
      
      default:
        return "Welcome to EdTech AI Hub! 🚀 This is your comprehensive learning platform powered by AI. You can navigate through different sections using the menu or the quick access links I'll provide below. Each section offers unique features to enhance your learning experience.";
    }
  };

  // Get relevant components based on current context
  const getRelevantComponents = (): SystemComponent[] => {
    const currentCategory = currentPage?.category || "main";
    
    // Always include main navigation components
    const mainComponents = systemComponents.filter(comp => comp.category === "main");
    
    // Add components from the same category
    const categoryComponents = systemComponents.filter(comp => 
      comp.category === currentCategory && comp.url !== currentPath
    );
    
    // Add some AI-powered components as suggestions
    const aiComponents = systemComponents.filter(comp => 
      comp.category === "ai" && comp.url !== currentPath
    );
    
    return [...mainComponents, ...categoryComponents, ...aiComponents.slice(0, 2)];
  };

  // Generate quick actions based on current page
  const getQuickActions = (): string[] => {
    // Handle dynamic routes
    if (currentPath.startsWith("/exams/") && currentPath !== "/exams") {
      return [
        "Use Previous/Next buttons to navigate questions",
        "Click question numbers for quick navigation",
        "Monitor your time with the countdown timer",
        "Submit exam when ready or let it auto-submit"
      ];
    }
    
    if (currentPath.startsWith("/subjects/") && currentPath !== "/subjects/my-subjects") {
      return [
        "Explore subject-specific resources",
        "Take practice exams for this subject",
        "Get AI study recommendations",
        "Track your progress in this subject"
      ];
    }
    
    const baseActions = [
      "Navigate to Dashboard for overview",
      "Access AI Tutor for personalized help",
      "Check your learning progress"
    ];
    
    switch (currentPath) {
      case "/dashboard":
        return [
          "Explore your enrolled subjects",
          "Take a practice exam",
          "Generate a learning path",
          "Access learning tools"
        ];
      
      case "/exams":
        return [
          "Browse exams by subject",
          "Generate custom practice questions",
          "Start an available exam",
          "View your exam history"
        ];
      
      case "/subjects/my-subjects":
        return [
          "Click on a subject to explore it",
          "View progress for each subject",
          "Access subject-specific exams",
          "Get AI recommendations for study materials"
        ];
      
      case "/tutor":
        return [
          "Ask specific questions about any subject",
          "Request explanations for difficult concepts",
          "Get help with homework assignments",
          "Practice with interactive examples"
        ];
      
      case "/learning-tools":
        return [
          "Create study plans and schedules",
          "Track your learning progress",
          "Take interactive quizzes",
          "Access learning resource library"
        ];
      
      case "/learning-path":
        return [
          "Generate a personalized study plan",
          "Set learning goals and milestones",
          "Track your learning path progress",
          "Get AI-powered study recommendations"
        ];
      
      default:
        return baseActions;
    }
  };

  return {
    guidance: getContextualGuidance(),
    relevantComponents: getRelevantComponents(),
    quickActions: getQuickActions()
  };
};

export function AIFloatingHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIHelpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Generate AI response when opened or path changes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setIsLoading(true);
      // Simulate AI processing time
      setTimeout(() => {
        setAiResponse(generateAIResponse(pathname));
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, isMinimized, pathname]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const navigateToComponent = (url: string) => {
    router.push(url);
    setIsOpen(false); // Close the help panel after navigation
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed right-6 bottom-6 z-[9999]">
        <div className="relative">
          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-ping"></div>
          
          <Button
            onClick={handleToggle}
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-2 border-white/20 relative hover:scale-105"
            size="icon"
          >
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
          </Button>
          
          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              AI Learning Assistant
            </div>
          )}
        </div>
      </div>

      {/* AI Help Panel */}
      {isOpen && (
        <div className="fixed right-6 bottom-24 z-[9998] w-96 max-h-[70vh] animate-in slide-in-from-bottom-2 duration-300">
          <Card className="shadow-2xl border-2 border-blue-200/50 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Learning Assistant</CardTitle>
                    <CardDescription className="text-xs">Real-time system guidance</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMinimize}
                    className="h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggle}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="pt-0">
                <ScrollArea className="h-full max-h-[50vh]">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">Analyzing your current context...</span>
                      </div>
                    </div>
                  ) : aiResponse ? (
                    <div className="space-y-4">
                      {/* AI Guidance */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <h3 className="font-medium text-sm">Smart Guidance</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {aiResponse.guidance}
                        </p>
                      </div>

                      <Separator />

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-green-500" />
                          <h3 className="font-medium text-sm">Quick Actions</h3>
                        </div>
                        <div className="space-y-1">
                          {aiResponse.quickActions.map((action, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <ArrowRight className="h-3 w-3 text-blue-500" />
                              <span className="text-muted-foreground">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* System Components */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-purple-500" />
                          <h3 className="font-medium text-sm">System Components</h3>
                        </div>
                        <div className="space-y-2">
                          {aiResponse.relevantComponents.map((component, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => navigateToComponent(component.url)}
                            >
                              <div className="flex items-center gap-2">
                                <component.icon className="h-4 w-4 text-blue-500" />
                                <div>
                                  <p className="font-medium text-sm">{component.name}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {component.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  {component.category}
                                </Badge>
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t">
                        <p className="text-xs text-center text-muted-foreground">
                          💡 This AI assistant provides real-time guidance based on your current location in the system.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
}

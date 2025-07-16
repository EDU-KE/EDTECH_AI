
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { chartConfig, progressData, subjects } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useTransition, useEffect, useMemo, useCallback, useRef } from "react";
import { Bot, Download, Loader2, Star, Target, TrendingUp, CheckCircle, BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, Award, BookOpen, Calendar, Clock } from "lucide-react";
import { getProgressInsights } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { ProgressGoals } from "@/components/progress-goals";
import { LearningStreaks } from "@/components/learning-streaks";
import { SubjectComparison } from "@/components/subject-comparison";
import { ProgressCache } from "@/lib/cache/progress-cache";
import PerformanceMonitor from "@/components/performance-monitor";

type SubjectKey = keyof typeof progressData | 'all';
type ChartType = "bar" | "line" | "pie";

interface SubjectStats {
    average: number;
    highest: number;
    bestMonth: string;
}

const PIE_CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF19AF"];


export default function ProgressPage() {
    const [selectedSubject, setSelectedSubject] = useState<SubjectKey>("all");
    const [insights, setInsights] = useState<string | null>(null);
    const [stats, setStats] = useState<SubjectStats | null>(null);
    const [isInsightsPending, startInsightsTransition] = useTransition();
    const [chartType, setChartType] = useState<ChartType>("bar");
    const { toast } = useToast();
    const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();
    
    // Performance optimizations
    const insightsCache = useRef<Map<string, string>>(new Map());
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Memoized subject progress with caching
    const subjectProgress = useMemo(() => {
        return ProgressCache.getSubjectProgress(selectedSubject) || [];
    }, [selectedSubject]);

    // Memoized stats with caching
    const memoizedStats = useMemo(() => {
        return ProgressCache.getProgressStats(selectedSubject);
    }, [selectedSubject]);

    // Optimized insights fetching with debouncing and caching
    const fetchInsightsOptimized = useCallback(
        (subject: string) => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(async () => {
                if (subject === 'all') {
                    setInsights("Showing combined progress for all subjects. Select a specific subject to get detailed AI insights.");
                    return;
                }

                // Check cache first
                const cachedInsights = ProgressCache.getInsights(subject);
                if (cachedInsights) {
                    setInsights(cachedInsights);
                    return;
                }

                // Fetch from API
                startInsightsTransition(async () => {
                    try {
                        const progressData = ProgressCache.getSubjectProgress(subject);
                        if (!progressData || progressData.length === 0) return;

                        const formData = new FormData();
                        formData.append("subject", subject);
                        formData.append("progressData", JSON.stringify(progressData));
                        
                        const result = await getProgressInsights(formData);
                        if (result.error) {
                            toast({ 
                                variant: "destructive", 
                                title: "AI Insights Error", 
                                description: result.error 
                            });
                        } else if (result.insights) {
                            ProgressCache.setInsights(subject, result.insights);
                            setInsights(result.insights);
                        }
                    } catch (error) {
                        console.error('Error fetching insights:', error);
                        toast({ 
                            variant: "destructive", 
                            title: "Error", 
                            description: "Failed to fetch AI insights" 
                        });
                    }
                });
            }, 300); // 300ms debounce
        },
        [toast, startInsightsTransition]
    );

    // Effects with optimizations
    useEffect(() => {
        if (memoizedStats) {
            setStats(memoizedStats);
        }
        
        fetchInsightsOptimized(selectedSubject);
        
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [selectedSubject, memoizedStats, fetchInsightsOptimized]);

    // Optimized top subject handler
    const handleShowTopSubject = useCallback(() => {
        const topSubject = ProgressCache.getTopSubject();
        if (topSubject) {
            const subjectTitle = subjects.find(s => s.id === topSubject)?.title || topSubject;
            toast({ 
                title: "Top Subject Found!", 
                description: `Switching to ${subjectTitle}` 
            });
            setSelectedSubject(topSubject);
        }
    }, [toast]);
  
    // Memoized current subject title
    const currentSubjectTitle = useMemo(() => {
        if (selectedSubject === 'all') return "All Subjects";
        return subjects.find(s => s.id === selectedSubject)?.title || "Selected Subject";
    }, [selectedSubject]);

    // Memoized chart rendering with performance optimizations
    const renderChart = useCallback(() => {
        if (!subjectProgress || subjectProgress.length === 0) {
            return (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>No data available for selected subject</p>
                </div>
            );
        }

        const commonProps = {
            accessibilityLayer: true,
            data: subjectProgress
        };

        switch(chartType) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                            type="monotone" 
                            dataKey="progress" 
                            stroke="var(--color-progress)" 
                            strokeWidth={2} 
                            dot={{ r: 5 }}
                            connectNulls={false}
                        />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="month" />} />
                        <Pie 
                            data={subjectProgress} 
                            dataKey="progress" 
                            nameKey="month" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={120} 
                            labelLine={false}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {subjectProgress.map((_entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} 
                                />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                );
            case 'bar':
            default:
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="progress" fill="var(--color-progress)" radius={4} />
                    </BarChart>
                );
        }
    }, [subjectProgress, chartType]);

    // Optimized chart type handler
    const handleChartTypeChange = useCallback((value: ChartType) => {
        if (value) {
            setChartType(value);
        }
    }, []);

    // Optimized subject selection handler
    const handleSubjectChange = useCallback((value: string) => {
        setSelectedSubject(value as SubjectKey);
    }, []);

  return (
    <AppShell title="Overall Progress">
      {/* Header Section with Curriculum Theme */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${theme?.secondary || 'bg-gray-100'} border ${theme?.border || 'border-gray-200'}`}>
              <TrendingUp className={`h-6 w-6 ${theme?.accent || 'text-gray-600'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${theme?.accent || 'text-gray-900'}`}>
                Learning Progress Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                {curriculumInfo ? `${curriculumInfo.name} Progress Analytics` : 'Track your academic journey'}
              </p>
            </div>
          </div>
          {curriculum && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${theme?.badge || 'bg-gray-100'}`}>
                <div className="text-lg mr-1">{curriculumInfo?.icon}</div>
                {curriculum}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Target className={`h-4 w-4 ${theme?.accent || 'text-gray-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.average?.toFixed(1) || '0'}%</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>
        
        <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
            <Award className={`h-4 w-4 ${theme?.accent || 'text-yellow-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.highest?.toFixed(1) || '0'}%</div>
            <p className="text-xs text-muted-foreground">Highest score achieved</p>
          </CardContent>
        </Card>
        
        <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className={`h-4 w-4 ${theme?.accent || 'text-blue-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Subjects in progress</p>
          </CardContent>
        </Card>
        
        <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Period</CardTitle>
            <Calendar className={`h-4 w-4 ${theme?.accent || 'text-green-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectProgress.length}</div>
            <p className="text-xs text-muted-foreground">Months tracked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
            <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
            <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
                            <TrendingUp className={`h-5 w-5 ${theme?.accent || 'text-gray-600'}`} />
                            Progress Analytics
                        </CardTitle>
                        <CardDescription>Your progress across different subjects and time periods</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <ToggleGroup 
                            type="single" 
                            value={chartType} 
                            onValueChange={handleChartTypeChange} 
                            aria-label="Chart type"
                            className={`${theme?.border || 'border-gray-200'}`}
                        >
                            <ToggleGroupItem value="bar" aria-label="Bar chart">
                                <BarChartIcon className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="line" aria-label="Line chart">
                                <LineChartIcon className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="pie" aria-label="Pie chart">
                                <PieChartIcon className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <div className="w-full sm:w-[180px]">
                            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                                <SelectTrigger className={`${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'}`}>
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>{subject.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    {renderChart()}
                </ChartContainer>
            </CardContent>
            </Card>
            
            <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
            <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${theme?.primary || 'bg-gradient-to-br from-blue-500 to-purple-500'} text-white shadow-lg`}>
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className={`${theme?.accent || 'text-gray-900'} flex items-center gap-2`}>
                                AI-Powered Insights
                                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                    SMART
                                </Badge>
                            </CardTitle>
                            <CardDescription>Personalized feedback on your learning patterns for {currentSubjectTitle}</CardDescription>
                        </div>
                    </div>
                    {selectedSubject !== 'all' && (
                        <Button 
                            onClick={() => fetchInsightsOptimized(selectedSubject)}
                            disabled={isInsightsPending}
                            size="sm"
                            className={`${theme?.primary || 'bg-gradient-to-r from-blue-500 to-purple-500'} hover:opacity-90 text-white shadow-lg border-0`}
                        >
                            {isInsightsPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Bot className="h-4 w-4 mr-2" />
                            )}
                            {isInsightsPending ? 'Analyzing...' : 'Analyze'}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="min-h-[80px] p-6">
                {isInsightsPending && selectedSubject !== 'all' && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className={`h-5 w-5 animate-spin ${theme?.primary || 'text-blue-500'}`} />
                        <p>Analyzing your progress...</p>
                    </div>
                )}
                {insights && (
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                        {insights}
                    </div>
                )}
                {!isInsightsPending && !insights && selectedSubject !== 'all' && (
                    <div className="text-center py-8">
                        <div className={`inline-flex p-4 rounded-full ${theme?.secondary || 'bg-gray-50'} mb-4`}>
                            <Bot className={`h-8 w-8 ${theme?.accent || 'text-gray-600'}`} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Click "Analyze" to get AI-powered insights for {currentSubjectTitle}</p>
                        <Button 
                            onClick={() => fetchInsightsOptimized(selectedSubject)}
                            size="lg"
                            className={`${theme?.primary || 'bg-gradient-to-r from-blue-500 to-purple-500'} hover:opacity-90 text-white border-0 shadow-lg`}
                        >
                            <Bot className="h-5 w-5 mr-2" />
                            Generate AI Insights
                        </Button>
                    </div>
                )}
                {selectedSubject === 'all' && (
                    <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">Showing combined progress for all subjects. Select a specific subject to get detailed AI insights.</p>
                    </div>
                )}
            </CardContent>
            </Card>
        </div>
        <div className="space-y-4">
            <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
                <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                    <CardTitle className={`${theme?.accent || 'text-gray-900'}`}>Quick Actions</CardTitle>
                    <CardDescription>Analyze your performance further</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 p-4">
                    <Button 
                        onClick={handleShowTopSubject} 
                        variant="outline"
                        className={`${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'}`}
                    >
                        <Star className="mr-2 h-4 w-4" /> Show Top Subject
                    </Button>
                    {selectedSubject !== 'all' && (
                        <Button 
                            onClick={() => fetchInsightsOptimized(selectedSubject)}
                            disabled={isInsightsPending}
                            className={`${theme?.primary || 'bg-gradient-to-r from-blue-500 to-purple-500'} hover:opacity-90 text-white border-0 shadow-lg`}
                        >
                            {isInsightsPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Bot className="mr-2 h-4 w-4" />
                            )}
                            {isInsightsPending ? 'Analyzing...' : 'AI Analyze Subject'}
                        </Button>
                    )}
                     <Button 
                        onClick={() => toast({ title: "Generating Report...", description: "Your report will be downloaded shortly." })}
                        className={`${theme?.primary || 'bg-gray-900'} hover:opacity-90 text-white border-0`}
                    >
                        <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                </CardContent>
            </Card>
            
            <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
                <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                    <CardTitle className={`${theme?.accent || 'text-gray-900'}`}>Performance Metrics</CardTitle>
                    <CardDescription>Key statistics for {currentSubjectTitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                    {stats ? (
                        <>
                            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <Target className={`h-5 w-5 ${theme?.accent || 'text-primary'}`} />
                                        <span className="font-medium">Average Progress</span>
                                    </div>
                                    <span className="font-bold text-lg">{stats.average.toFixed(1)}%</span>
                                </div>
                                <Progress value={stats.average} className="h-2" />
                            </div>
                            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className={`h-5 w-5 ${theme?.accent || 'text-primary'}`} />
                                        <span className="font-medium">Highest Score</span>
                                    </div>
                                    <span className="font-bold text-lg">{stats.highest.toFixed(1)}%</span>
                                </div>
                                <Progress value={stats.highest} className="h-2" />
                            </div>
                             <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className={`h-5 w-5 ${theme?.accent || 'text-primary'}`} />
                                        <span className="font-medium">Best Month</span>
                                    </div>
                                    <Badge variant="secondary" className={`${theme?.badge || 'bg-gray-100'}`}>
                                        {stats.bestMonth}
                                    </Badge>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No data to analyze for this subject.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Additional Progress Components */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ProgressGoals />
        <LearningStreaks />
      </div>
      
      {/* Subject Comparison */}
      <div className="mt-8">
        <SubjectComparison />
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor />
    </AppShell>
  );
}

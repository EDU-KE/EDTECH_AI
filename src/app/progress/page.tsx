
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
import { useState, useTransition, useEffect, useMemo } from "react";
import { Bot, Download, Loader2, Star, Target, TrendingUp, CheckCircle, BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { getProgressInsights } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

    const subjectProgress = useMemo(() => {
        if (selectedSubject === 'all') {
            const combinedData: { [month: string]: { total: number, count: number } } = {};
            Object.values(progressData).forEach(subjectData => {
                subjectData.forEach(monthData => {
                    if (!combinedData[monthData.month]) {
                        combinedData[monthData.month] = { total: 0, count: 0 };
                    }
                    combinedData[monthData.month].total += monthData.progress;
                    combinedData[monthData.month].count++;
                });
            });
            return Object.entries(combinedData).map(([month, data]) => ({
                month,
                progress: data.count > 0 ? Math.round(data.total / data.count) : 0,
            }));
        }
        return progressData[selectedSubject as keyof typeof progressData];
    }, [selectedSubject]);

    useEffect(() => {
      async function fetchData() {
          if (!selectedSubject || !subjectProgress || subjectProgress.length === 0) {
              setInsights(null);
              setStats(null);
              return;
          }

          // Calculate stats
          const totalProgress = subjectProgress.reduce((acc, curr) => acc + curr.progress, 0);
          const average = totalProgress / subjectProgress.length;
          const highest = Math.max(...subjectProgress.map(p => p.progress));
          const bestMonth = subjectProgress.find(p => p.progress === highest)?.month || "N/A";
          setStats({ average, highest, bestMonth });

          // Fetch AI insights only for single subjects
          if (selectedSubject !== 'all') {
            setInsights(null);
            startInsightsTransition(async () => {
                const formData = new FormData();
                formData.append("subject", selectedSubject);
                formData.append("progressData", JSON.stringify(subjectProgress));
                
                const result = await getProgressInsights(formData);
                if (result.error) {
                    toast({ variant: "destructive", title: "AI Insights Error", description: result.error });
                } else {
                    setInsights(result.insights ?? null);
                }
            });
          } else {
            setInsights("Showing combined progress for all subjects. Select a specific subject to get detailed AI insights.");
          }
      }
      fetchData();
  }, [selectedSubject, subjectProgress, toast]);

  const handleShowTopSubject = () => {
    let topSubject: keyof typeof progressData = "math";
    let maxAverage = -1;

    for (const key in progressData) {
        const subjectKey = key as keyof typeof progressData;
        const data = progressData[subjectKey];
        if (data.length > 0) {
            const avg = data.reduce((acc, curr) => acc + curr.progress, 0) / data.length;
            if (avg > maxAverage) {
                maxAverage = avg;
                topSubject = subjectKey;
            }
        }
    }
    toast({ title: "Top Subject Found!", description: `Switching to ${subjects.find(s => s.id === topSubject)?.title}` });
    setSelectedSubject(topSubject);
  };
  
  const currentSubjectTitle = useMemo(() => {
    if (selectedSubject === 'all') return "All Subjects";
    return subjects.find(s=>s.id === selectedSubject)?.title || "Selected Subject";
  }, [selectedSubject]);

  const renderChart = () => {
    switch(chartType) {
        case 'line':
            return (
                <LineChart accessibilityLayer data={subjectProgress}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="progress" stroke="var(--color-progress)" strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
            )
        case 'pie':
            return (
                 <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="month" />} />
                    <Pie data={subjectProgress} dataKey="progress" nameKey="month" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        );
                    }}>
                        {subjectProgress.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            )
        case 'bar':
        default:
            return (
                <BarChart accessibilityLayer data={subjectProgress}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="progress" fill="var(--color-progress)" radius={4} />
                </BarChart>
            )
    }
  }

  return (
    <AppShell title="Overall Progress">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
            <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <CardTitle>Overall Learner Progress</CardTitle>
                        <CardDescription>Your progress across different subjects.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <ToggleGroup type="single" value={chartType} onValueChange={(value: ChartType) => value && setChartType(value)} aria-label="Chart type">
                            <ToggleGroupItem value="bar" aria-label="Bar chart"><BarChartIcon className="h-4 w-4" /></ToggleGroupItem>
                            <ToggleGroupItem value="line" aria-label="Line chart"><LineChartIcon className="h-4 w-4" /></ToggleGroupItem>
                            <ToggleGroupItem value="pie" aria-label="Pie chart"><PieChartIcon className="h-4 w-4" /></ToggleGroupItem>
                        </ToggleGroup>
                        <div className="w-full sm:w-[180px]">
                            <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as SubjectKey)}>
                                <SelectTrigger>
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
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    {renderChart()}
                </ChartContainer>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Bot className="h-6 w-6 text-primary" />
                <div>
                    <CardTitle>AI-Powered Insights</CardTitle>
                    <CardDescription>Personalized feedback on your learning patterns for {currentSubjectTitle}.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="min-h-[80px]">
                {isInsightsPending && selectedSubject !== 'all' && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p>Analyzing your progress...</p>
                    </div>
                )}
                {insights && (
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                    {insights}
                    </div>
                )}
                {!isInsightsPending && !insights && (
                    <p className="text-sm text-muted-foreground">Could not load AI insights at the moment.</p>
                )}
            </CardContent>
            </Card>
        </div>
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Chart Actions</CardTitle>
                    <CardDescription>Analyze your performance further.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                    <Button onClick={handleShowTopSubject} variant="outline">
                        <Star className="mr-2 h-4 w-4" /> Show Top Subject
                    </Button>
                     <Button onClick={() => toast({ title: "Generating Report...", description: "Your report will be downloaded shortly." })}>
                        <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Data Insights</CardTitle>
                    <CardDescription>Key statistics for {currentSubjectTitle}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {stats ? (
                        <>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Target className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Average Progress</span>
                                </div>
                                <span className="font-bold text-lg">{stats.average.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Highest Score</span>
                                </div>
                                <span className="font-bold text-lg">{stats.highest.toFixed(1)}%</span>
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Best Month</span>
                                </div>
                                <span className="font-bold text-lg">{stats.bestMonth}</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No data to analyze for this subject.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}

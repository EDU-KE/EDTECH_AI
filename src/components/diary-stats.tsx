'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle,
  BarChart3,
  Zap
} from "lucide-react";

interface DiaryStatsProps {
  totalEntries: number;
  completedTasks: number;
  totalTasks: number;
  weeklyStreak: number;
  studyTime: number;
}

export function DiaryStats({ 
  totalEntries, 
  completedTasks, 
  totalTasks, 
  weeklyStreak, 
  studyTime 
}: DiaryStatsProps) {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const stats = [
    {
      icon: BookOpen,
      label: "Total Entries",
      value: totalEntries,
      suffix: "entries",
      color: theme?.accent || "text-blue-600"
    },
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: completedTasks,
      suffix: `of ${totalTasks}`,
      color: "text-green-600"
    },
    {
      icon: Zap,
      label: "Weekly Streak",
      value: weeklyStreak,
      suffix: "days",
      color: theme?.accent || "text-orange-600"
    },
    {
      icon: Clock,
      label: "Study Time",
      value: studyTime,
      suffix: "hours",
      color: theme?.accent || "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.suffix}</p>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Completion Rate Card */}
      <Card className={`md:col-span-2 lg:col-span-2 border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${theme?.accent || 'text-gray-900'}`}>
            <Target className="h-4 w-4" />
            Completion Rate
            {curriculum && (
              <Badge variant="outline" className={`ml-2 ${theme?.badge || 'bg-gray-100'}`}>
                {curriculum}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tasks Completed</span>
              <span className="text-sm font-medium">{completionRate.toFixed(1)}%</span>
            </div>
            <Progress 
              value={completionRate} 
              className="h-2"
              style={{
                background: theme?.secondary || '#f3f4f6'
              }}
            />
            <p className="text-xs text-muted-foreground">
              {completedTasks} out of {totalTasks} tasks completed this week
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Insights */}
      <Card className={`md:col-span-2 lg:col-span-2 border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${theme?.accent || 'text-gray-900'}`}>
            <BarChart3 className="h-4 w-4" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                {weeklyStreak >= 5 ? "Great consistency!" : "Building momentum"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                {totalEntries >= 10 ? "Active journaling" : "Getting started"}
              </span>
            </div>
            {curriculumInfo && (
              <div className="flex items-center gap-2">
                <div className="text-sm">{curriculumInfo.icon}</div>
                <span className="text-sm">
                  Optimized for {curriculumInfo.name}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

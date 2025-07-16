'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { Flame, Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface StreakData {
  current: number;
  longest: number;
  thisWeek: number;
  thisMonth: number;
  lastActivity: string;
  weeklyGoal: number;
}

const mockStreakData: StreakData = {
  current: 12,
  longest: 28,
  thisWeek: 5,
  thisMonth: 23,
  lastActivity: '2 hours ago',
  weeklyGoal: 7
};

const weeklyCalendar = [
  { day: 'Mon', date: '15', active: true, streak: true },
  { day: 'Tue', date: '16', active: true, streak: true },
  { day: 'Wed', date: '17', active: false, streak: false },
  { day: 'Thu', date: '18', active: true, streak: true },
  { day: 'Fri', date: '19', active: true, streak: true },
  { day: 'Sat', date: '20', active: true, streak: true },
  { day: 'Sun', date: '21', active: false, streak: false },
];

export function LearningStreaks() {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();
  const [streakData] = useState<StreakData>(mockStreakData);

  const weeklyProgress = (streakData.thisWeek / streakData.weeklyGoal) * 100;

  return (
    <div className="space-y-4">
      {/* Streak Overview */}
      <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
          <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
            <Flame className={`h-5 w-5 ${theme?.accent || 'text-orange-600'}`} />
            Learning Streaks
            {curriculum && (
              <Badge variant="outline" className={`ml-2 ${theme?.badge || 'bg-gray-100'}`}>
                {curriculum}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Track your daily learning consistency
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'} text-center`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Current</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {streakData.current}
              </div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'} text-center`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Best</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {streakData.longest}
              </div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'} text-center`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">This Week</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {streakData.thisWeek}
              </div>
              <div className="text-xs text-muted-foreground">/ {streakData.weeklyGoal} days</div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'} text-center`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">This Month</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {streakData.thisMonth}
              </div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Goal Progress</span>
                <span className="text-sm text-muted-foreground">
                  {streakData.thisWeek} / {streakData.weeklyGoal} days
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {weeklyProgress.toFixed(0)}% of weekly goal achieved
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Last activity: {streakData.lastActivity}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar */}
      <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
            <Calendar className={`h-5 w-5 ${theme?.accent || 'text-blue-600'}`} />
            This Week
          </CardTitle>
          <CardDescription>
            Your daily learning activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyCalendar.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    day.active 
                      ? day.streak 
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md' 
                        : 'bg-blue-100 text-blue-600 border border-blue-200'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {day.active && day.streak && (
                    <Flame className="h-4 w-4" />
                  )}
                  {day.active && !day.streak && (
                    <Target className="h-4 w-4" />
                  )}
                  {!day.active && (
                    <span className="text-xs">{day.date}</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {day.date}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600"></div>
                  <span className="text-xs text-muted-foreground">Active streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
                  <span className="text-xs text-muted-foreground">Study day</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div>
                  <span className="text-xs text-muted-foreground">Rest day</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { subjects, progressData } from "@/lib/mock-data";
import { BarChart3, TrendingUp, TrendingDown, Minus, BookOpen, Target } from "lucide-react";
import { useMemo } from "react";

interface SubjectComparison {
  id: string;
  title: string;
  average: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  completion: number;
  rank: number;
}

export function SubjectComparison() {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();

  const subjectComparisons = useMemo(() => {
    const comparisons: SubjectComparison[] = [];

    subjects.forEach(subject => {
      const subjectData = progressData[subject.id as keyof typeof progressData];
      if (subjectData && subjectData.length > 0) {
        const average = subjectData.reduce((sum, data) => sum + data.progress, 0) / subjectData.length;
        const recentProgress = subjectData.slice(-3);
        const earlierProgress = subjectData.slice(-6, -3);
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        let trendValue = 0;
        
        if (recentProgress.length > 0 && earlierProgress.length > 0) {
          const recentAvg = recentProgress.reduce((sum, data) => sum + data.progress, 0) / recentProgress.length;
          const earlierAvg = earlierProgress.reduce((sum, data) => sum + data.progress, 0) / earlierProgress.length;
          trendValue = recentAvg - earlierAvg;
          
          if (trendValue > 2) trend = 'up';
          else if (trendValue < -2) trend = 'down';
          else trend = 'stable';
        }

        comparisons.push({
          id: subject.id,
          title: subject.title,
          average: average,
          trend,
          trendValue: Math.abs(trendValue),
          completion: Math.min(average, 100),
          rank: 0 // Will be set after sorting
        });
      }
    });

    // Sort by average and assign ranks
    comparisons.sort((a, b) => b.average - a.average);
    comparisons.forEach((comp, index) => {
      comp.rank = index + 1;
    });

    return comparisons;
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const topPerformer = subjectComparisons[0];
  const needsAttention = subjectComparisons.find(comp => comp.average < 70);

  return (
    <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
      <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
        <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
          <BarChart3 className={`h-5 w-5 ${theme?.accent || 'text-blue-600'}`} />
          Subject Performance Comparison
          {curriculum && (
            <Badge variant="outline" className={`ml-2 ${theme?.badge || 'bg-gray-100'}`}>
              {curriculum}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Compare your performance across all subjects
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Performance Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {topPerformer && (
            <div className={`p-4 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className={`h-4 w-4 ${theme?.accent || 'text-yellow-600'}`} />
                <span className="font-medium text-sm">Top Performer</span>
              </div>
              <div className="text-lg font-bold">{topPerformer.title}</div>
              <div className="text-sm text-muted-foreground">
                {topPerformer.average.toFixed(1)}% average score
              </div>
            </div>
          )}
          
          {needsAttention && (
            <div className={`p-4 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className={`h-4 w-4 ${theme?.accent || 'text-red-600'}`} />
                <span className="font-medium text-sm">Needs Attention</span>
              </div>
              <div className="text-lg font-bold">{needsAttention.title}</div>
              <div className="text-sm text-muted-foreground">
                {needsAttention.average.toFixed(1)}% average score
              </div>
            </div>
          )}
        </div>

        {/* Subject Rankings */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Subject Rankings</h4>
          {subjectComparisons.map((subject) => (
            <div 
              key={subject.id}
              className={`p-4 rounded-lg border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'} transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-xs ${getRankBadgeColor(subject.rank)}`}>
                    #{subject.rank}
                  </Badge>
                  <div>
                    <h5 className="font-medium text-sm">{subject.title}</h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getTrendIcon(subject.trend)}
                      <span className={getTrendColor(subject.trend)}>
                        {subject.trend === 'stable' ? 'Stable' : 
                         subject.trend === 'up' ? `+${subject.trendValue.toFixed(1)}%` : 
                         `-${subject.trendValue.toFixed(1)}%`}
                      </span>
                      <span>• Last 3 months</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{subject.average.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">average</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs text-muted-foreground">
                    {subject.completion.toFixed(0)}% complete
                  </span>
                </div>
                <Progress value={subject.completion} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">
                {subjectComparisons.filter(s => s.average >= 80).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Subjects above 80%
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {subjectComparisons.filter(s => s.trend === 'up').length}
              </div>
              <div className="text-xs text-muted-foreground">
                Improving subjects
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {(subjectComparisons.reduce((sum, s) => sum + s.average, 0) / subjectComparisons.length).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Overall average
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { Target, Plus, CheckCircle, Clock, TrendingUp, Trophy, Flag } from "lucide-react";
import { useState } from "react";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetScore: number;
  currentScore: number;
  deadline: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'overdue';
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Master Algebra Fundamentals',
    description: 'Achieve 90% proficiency in algebraic equations',
    targetScore: 90,
    currentScore: 78,
    deadline: '2025-08-15',
    subject: 'Math',
    priority: 'high',
    status: 'active'
  },
  {
    id: '2',
    title: 'Improve Science Lab Skills',
    description: 'Complete all chemistry experiments with 85% accuracy',
    targetScore: 85,
    currentScore: 85,
    deadline: '2025-07-30',
    subject: 'Science',
    priority: 'medium',
    status: 'completed'
  },
  {
    id: '3',
    title: 'English Literature Analysis',
    description: 'Write comprehensive essays on 5 classic novels',
    targetScore: 80,
    currentScore: 65,
    deadline: '2025-07-10',
    subject: 'English',
    priority: 'high',
    status: 'overdue'
  },
  {
    id: '4',
    title: 'History Research Project',
    description: 'Complete in-depth research on World War II',
    targetScore: 88,
    currentScore: 45,
    deadline: '2025-09-01',
    subject: 'History',
    priority: 'medium',
    status: 'active'
  }
];

export function ProgressGoals() {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showAll, setShowAll] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <Clock className="h-4 w-4 text-red-600" />;
      case 'active': return <Target className="h-4 w-4 text-blue-600" />;
      default: return <Flag className="h-4 w-4 text-gray-600" />;
    }
  };

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const displayedGoals = showAll ? goals : goals.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Goals Overview */}
      <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
          <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
            <Trophy className={`h-5 w-5 ${theme?.accent || 'text-yellow-600'}`} />
            Learning Goals
            {curriculum && (
              <Badge variant="outline" className={`ml-2 ${theme?.badge || 'bg-gray-100'}`}>
                {curriculum}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Track your academic objectives and milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Target className={`h-4 w-4 ${theme?.accent || 'text-blue-600'}`} />
                <span className="text-sm font-medium">Active Goals</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {goals.filter(g => g.status === 'active').length}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {completedGoals}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${theme?.accent || 'text-purple-600'}`} />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {overallProgress.toFixed(0)}%
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedGoals} of {totalGoals} goals completed
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Individual Goals */}
      <Card className={`border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={`${theme?.accent || 'text-gray-900'}`}>Current Goals</CardTitle>
            <CardDescription>Your active learning objectives</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className={`${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'}`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayedGoals.map((goal) => {
            const progressPercentage = (goal.currentScore / goal.targetScore) * 100;
            
            return (
              <div 
                key={goal.id} 
                className={`p-4 rounded-lg border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'} transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(goal.status)}
                      <h4 className="font-semibold text-sm">{goal.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{goal.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Subject: {goal.subject}</span>
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.currentScore} / {goal.targetScore}
                    </span>
                  </div>
                  <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {progressPercentage.toFixed(1)}% complete
                    </span>
                    {goal.status === 'completed' && (
                      <span className="text-xs text-green-600 font-medium">
                        Goal achieved!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {goals.length > 3 && (
            <div className="text-center pt-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className={`${theme?.hover || 'hover:bg-gray-50'}`}
              >
                {showAll ? 'Show Less' : `Show All ${goals.length} Goals`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurriculumTheme } from '@/hooks/use-curriculum-theme';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  TrendingUp, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function ThemeUpdateDemo() {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (curriculum) {
      setUpdateCount(prev => prev + 1);
      setLastUpdateTime(new Date());
    }
  }, [curriculum]);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading Theme...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!curriculum || !theme || !curriculumInfo) {
    return (
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            No Curriculum Selected
          </CardTitle>
          <CardDescription className="text-amber-700">
            Select a curriculum to see themed components in action.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const demoComponents = [
    {
      title: "Subject Card",
      icon: BookOpen,
      description: "Shows curriculum-specific styling for subject cards"
    },
    {
      title: "Leaderboard",
      icon: Trophy,
      description: "Themed leaderboard with curriculum colors"
    },
    {
      title: "Progress Tracker",
      icon: TrendingUp,
      description: "Progress indicators with curriculum theme"
    },
    {
      title: "Study Groups",
      icon: Users,
      description: "Community features with themed styling"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Live Theme Demo
          <Badge variant="outline" className={`ml-2 ${theme.badge}`}>
            {curriculum}
          </Badge>
        </CardTitle>
        <CardDescription>
          Components automatically update when curriculum changes
          {lastUpdateTime && (
            <span className="block text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdateTime.toLocaleTimeString()} ({updateCount} updates)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <Card 
                key={index} 
                className={`hover:shadow-lg transition-all duration-300 border-2 ${theme.border} ${theme.hover}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme.secondary}`}>
                      <Icon className={`w-5 h-5 ${theme.accent}`} />
                    </div>
                    <div>
                      <CardTitle className={`text-base ${theme.accent}`}>
                        {component.title}
                      </CardTitle>
                      <Badge variant="secondary" className={`text-xs ${theme.badge}`}>
                        {curriculumInfo.name}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {component.description}
                  </p>
                  <Button size="sm" className={`${theme.primary} text-white border-0 hover:opacity-90`}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Theme Info */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <h4 className="font-medium mb-2">Current Theme Details:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Curriculum:</span>
              <p className={`${theme.accent}`}>{curriculumInfo.name}</p>
            </div>
            <div>
              <span className="font-medium">Features:</span>
              <p className="text-muted-foreground">
                {curriculumInfo.features.slice(0, 2).join(', ')}
              </p>
            </div>
            <div>
              <span className="font-medium">Theme Updates:</span>
              <p className="text-muted-foreground">
                {updateCount === 0 ? 'Initial load' : `${updateCount} updates`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

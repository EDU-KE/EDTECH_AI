'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurriculumTheme } from '@/hooks/use-curriculum-theme';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurriculumThemeIndicatorProps {
  showDetails?: boolean;
}

export function CurriculumThemeIndicator({ showDetails = false }: CurriculumThemeIndicatorProps) {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();
  const [showThemeDetails, setShowThemeDetails] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading theme...</span>
      </div>
    );
  }

  if (!curriculum || !curriculumInfo) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-gray-300" />
        <span className="text-sm text-muted-foreground">No curriculum selected</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Theme Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full ${theme?.primary || 'bg-gray-300'}`} />
        <span className="text-sm font-medium">{curriculumInfo.icon} {curriculumInfo.name}</span>
        {showDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemeDetails(!showThemeDetails)}
            className="h-6 w-6 p-0"
          >
            {showThemeDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        )}
      </div>

      {/* Theme Details */}
      {showDetails && showThemeDetails && (
        <Card className="w-full max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Current Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Primary</p>
                <div className={`w-full h-6 rounded ${theme?.primary}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Secondary</p>
                <div className={`w-full h-6 rounded ${theme?.secondary} border`} />
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">Features</p>
              <div className="flex flex-wrap gap-1">
                {curriculumInfo.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className={`text-xs ${theme?.badge}`}>
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Curriculum Type</p>
              <p className={`text-sm font-medium ${theme?.accent}`}>{curriculum}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CurriculumThemeIndicator;

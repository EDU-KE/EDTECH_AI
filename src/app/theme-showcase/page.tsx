'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurriculumTheme } from '@/hooks/use-curriculum-theme';
import { getCurriculumInfo } from '@/lib/auth';
import { 
  BookOpen, 
  Settings, 
  Palette, 
  Eye, 
  Sparkles, 
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function ThemeShowcase() {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();
  const [selectedComponent, setSelectedComponent] = useState<string>('cards');

  const allCurriculums = ['CBE', '8-4-4', 'IGCSE'] as const;

  const ComponentShowcase = ({ componentType }: { componentType: string }) => {
    const currentTheme = theme;
    
    if (!currentTheme || !curriculumInfo) {
      return <div className="text-center py-8">No curriculum selected</div>;
    }

    switch (componentType) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Subject Card Example */}
            <Card className={`hover:shadow-lg transition-all duration-300 border-2 ${currentTheme.border} ${currentTheme.hover}`}>
              <CardHeader>
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentTheme.secondary} border ${currentTheme.border}`}>
                  <BookOpen className={`h-8 w-8 ${currentTheme.accent}`} />
                </div>
                <CardTitle className={`${currentTheme.accent}`}>Subject Card</CardTitle>
                <Badge variant="secondary" className={`w-fit ${currentTheme.badge}`}>Theme Example</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Example subject card with curriculum theme applied</p>
              </CardContent>
            </Card>

            {/* Dashboard Card Example */}
            <Card className={`hover:shadow-lg transition-all duration-300 border-2 ${currentTheme.border} ${currentTheme.hover}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-base ${currentTheme.accent}`}>Dashboard Card</CardTitle>
                <Settings className={`h-4 w-4 ${currentTheme.accent}`} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Dashboard card with themed styling</p>
              </CardContent>
            </Card>

            {/* Resource Card Example */}
            <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${currentTheme.border} ${currentTheme.hover}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${currentTheme.secondary}`}>
                    <BookOpen className={`h-4 w-4 ${currentTheme.accent}`} />
                  </div>
                  <Badge variant="outline" className={`text-xs ${currentTheme.badge}`}>Resource</Badge>
                </div>
                <CardTitle className={`text-base ${currentTheme.accent}`}>Learning Resource</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Themed learning resource card</p>
                <Button size="sm" className={`mt-2 ${currentTheme.primary} border-0 text-white hover:opacity-90`}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'buttons':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button className={`${currentTheme.primary} border-0 text-white hover:opacity-90`}>
                Primary Button
              </Button>
              <Button variant="outline" className={`${currentTheme.border} ${currentTheme.hover}`}>
                Outline Button
              </Button>
              <Button variant="secondary" className={`${currentTheme.badge}`}>
                Secondary Button
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className={`${currentTheme.badge}`}>Default Badge</Badge>
              <Badge variant="secondary" className={`${currentTheme.badge}`}>Secondary Badge</Badge>
              <Badge variant="outline" className={`${currentTheme.badge}`}>Outline Badge</Badge>
            </div>
          </div>
        );

      case 'theme-colors':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Color Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Primary Gradient</p>
                  <div className={`w-full h-12 rounded ${currentTheme.primary}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Secondary Background</p>
                  <div className={`w-full h-8 rounded ${currentTheme.secondary} border`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Border & Ring</p>
                  <div className={`w-full h-8 rounded border-2 ${currentTheme.border} ${currentTheme.ring}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {curriculumInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Badge variant="secondary" className={`text-xs ${currentTheme.badge}`}>
                        {feature}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading theme...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Live Curriculum Theme Showcase
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Experience your personalized curriculum theme across all components
        </p>
        
        {curriculum && curriculumInfo && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="text-3xl">{curriculumInfo.icon}</div>
            <div>
              <h2 className={`text-xl font-semibold ${theme?.accent}`}>
                {curriculumInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Active Theme: {curriculum}
              </p>
            </div>
          </div>
        )}
      </div>

      {!curriculum ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              No Curriculum Selected
            </CardTitle>
            <CardDescription>
              Select a curriculum to see the themed components in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/settings/curriculum">
                <ArrowRight className="h-4 w-4 mr-2" />
                Select Curriculum
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* All Curriculum Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Curriculum Theme Comparison
              </CardTitle>
              <CardDescription>
                See how different curricula have unique visual identities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allCurriculums.map((curr) => {
                  const info = getCurriculumInfo(curr);
                  const isActive = curr === curriculum;
                  
                  return (
                    <Card key={curr} className={`text-center ${isActive ? `border-2 ${info.theme.border}` : ''}`}>
                      <CardHeader className="relative">
                        <div className={`absolute inset-0 ${info.theme.primary} opacity-10 rounded-t-lg`} />
                        <div className="relative">
                          <div className="text-3xl mb-2">{info.icon}</div>
                          <CardTitle className={`text-sm ${info.theme.accent}`}>
                            {info.name}
                          </CardTitle>
                          {isActive && (
                            <Badge variant="default" className={`mt-2 ${info.theme.badge}`}>
                              Active
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {info.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className={`text-xs ${info.theme.badge}`}>
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Component Showcase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Themed Components
              </CardTitle>
              <CardDescription>
                Interactive showcase of how your theme is applied across different components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedComponent} onValueChange={setSelectedComponent}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="buttons">Buttons & Badges</TabsTrigger>
                  <TabsTrigger value="theme-colors">Theme Colors</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  <TabsContent value="cards" className="space-y-4">
                    <ComponentShowcase componentType="cards" />
                  </TabsContent>
                  
                  <TabsContent value="buttons" className="space-y-4">
                    <ComponentShowcase componentType="buttons" />
                  </TabsContent>
                  
                  <TabsContent value="theme-colors" className="space-y-4">
                    <ComponentShowcase componentType="theme-colors" />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

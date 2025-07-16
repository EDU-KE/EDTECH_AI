import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import type { OnlineTutor } from '@/lib/mock-data';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurriculumTheme, getThemeOrDefault } from '@/hooks/use-curriculum-theme';

interface TutorCardProps {
  tutor: OnlineTutor;
  compact?: boolean;
}

export const TutorCard = React.memo(function TutorCard({ tutor, compact = false }: TutorCardProps) {
  const { theme } = useCurriculumTheme();
  const currentTheme = getThemeOrDefault(theme);

  return (
    <Card className={cn(
      `hover:shadow-lg transition-all duration-300 h-full border-2 ${currentTheme.border} ${currentTheme.hover}`, 
      compact ? "flex items-center p-4 gap-4" : "flex flex-col"
    )}>
      <Avatar className={cn(compact ? 'h-16 w-16' : 'h-24 w-24 mx-auto mt-6')}>
        <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint={tutor.hint} />
        <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className={cn(!compact && "text-center")}>
        <CardHeader className={cn(compact ? "p-0" : "")}>
            <CardTitle className={cn(compact ? "text-base" : "", currentTheme.accent)}>{tutor.name}</CardTitle>
            <Badge variant="secondary" className={`w-fit mx-auto mt-1 ${currentTheme.badge}`}>{tutor.specialty}</Badge>
        </CardHeader>
        <CardContent className={cn("flex-grow", compact ? "p-0 hidden" : "pt-2")}>
          <div className="flex justify-center items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold">{tutor.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">/ 5.0</span>
          </div>
        </CardContent>
        <CardFooter className={cn(compact ? "p-0" : "")}>
          <Button asChild className={`w-full ${currentTheme.primary} border-0 text-white hover:opacity-90`}>
            <Link href={tutor.contact}>Contact</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
});
TutorCard.displayName = 'TutorCard';

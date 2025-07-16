import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import type { OnlineTutor } from '@/lib/mock-data';
import { Star, Clock, Users, MessageCircle, CheckCircle, XCircle, Globe, GraduationCap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurriculumTheme, getThemeOrDefault } from '@/hooks/use-curriculum-theme';

interface TutorCardProps {
  tutor: OnlineTutor;
  compact?: boolean;
}

export const TutorCard = React.memo(function TutorCard({ tutor, compact = false }: TutorCardProps) {
  const { theme } = useCurriculumTheme();
  const currentTheme = getThemeOrDefault(theme);

  if (compact) {
    return (
      <Card className={`hover:shadow-lg transition-all duration-300 border-2 ${currentTheme.border} ${currentTheme.hover} flex items-center p-4 gap-4`}>
        <Avatar className='h-16 w-16'>
          <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint={tutor.hint} />
          <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-semibold ${currentTheme.accent}`}>{tutor.name}</h3>
              <Badge variant="secondary" className={`${currentTheme.badge} mt-1`}>{tutor.specialty}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold">{tutor.rating.toFixed(1)}</span>
              </div>
              <Button size="sm" className={`${currentTheme.primary} border-0 text-white hover:opacity-90`}>
                <MessageCircle className="w-4 h-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 h-full border-2 ${currentTheme.border} ${currentTheme.hover} flex flex-col`}>
      <CardHeader className="text-center pb-2">
        <div className="relative">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint={tutor.hint} />
            <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute top-0 right-0">
            {tutor.isAvailable ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
        </div>
        <CardTitle className={`text-lg ${currentTheme.accent}`}>{tutor.name}</CardTitle>
        <Badge variant="secondary" className={`w-fit mx-auto ${currentTheme.badge}`}>
          {tutor.specialty}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-3">
        {/* Rating and Reviews */}
        <div className="flex justify-center items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold">{tutor.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">({tutor.reviews} reviews)</span>
        </div>

        {/* Key Information */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{tutor.experience} experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{tutor.totalStudents} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Responds in {tutor.responseTime}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-center">
          <span className={`text-lg font-bold ${currentTheme.primary.replace('bg-', 'text-')}`}>
            ${tutor.hourlyRate}/hr
          </span>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1 justify-center">
          {tutor.subjects.slice(0, 3).map((subject, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {subject}
            </Badge>
          ))}
          {tutor.subjects.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tutor.subjects.length - 3} more
            </Badge>
          )}
        </div>

        {/* Languages */}
        <div className="flex items-center justify-center gap-1">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {tutor.language.join(', ')}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full space-y-2">
          <Button 
            asChild 
            className={`w-full ${currentTheme.primary} border-0 text-white hover:opacity-90`}
            disabled={!tutor.isAvailable}
          >
            <Link href={tutor.contact}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {tutor.isAvailable ? 'Book Session' : 'Currently Unavailable'}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full text-xs">
            View Profile
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});
TutorCard.displayName = 'TutorCard';

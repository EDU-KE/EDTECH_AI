import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import type { Contest } from '@/lib/mock-data';
import { Calendar, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface ContestCardProps {
  contest: Contest;
}

export const ContestCard = React.memo(function ContestCard({ contest }: ContestCardProps) {
    const { toast } = useToast();

    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
                <div className="relative h-40 w-full">
                    <Image
                    src={contest.imageUrl}
                    alt={contest.title}
                    fill
                    className="rounded-t-lg object-cover"
                    data-ai-hint={contest.imageHint}
                    />
                </div>
                <div className='p-6'>
                    <CardTitle>{contest.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{contest.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{contest.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span>Prize: {contest.prize}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={() => toast({ title: "Registration Successful!", description: `You've registered for ${contest.title}`})}
                >
                    Register Now
                </Button>
            </CardFooter>
        </Card>
    );
});
ContestCard.displayName = 'ContestCard';

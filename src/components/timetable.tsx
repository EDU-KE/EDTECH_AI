
"use client"

import { format } from "date-fns"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { useEffect, useState } from "react"
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme"
import { Clock, Calendar } from "lucide-react"

export interface TimetableEvent {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
}

interface TimetableProps {
    events: TimetableEvent[];
}

export function Timetable({ events }: TimetableProps) {
    const [isClient, setIsClient] = useState(false)
    const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme()

    useEffect(() => {
        setIsClient(true)
    }, [])

    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

    // Don't render anything on the server to prevent hydration mismatch
    if (!isClient) {
        return (
            <Card className="p-4 relative h-[500px] overflow-y-auto">
                 {/* Placeholder or loader can go here */}
            </Card>
        );
    }

    return (
        <div className="relative h-[500px] overflow-y-auto">
            {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <div className={`p-4 rounded-full ${theme?.secondary || 'bg-gray-100'} mb-4`}>
                        <Calendar className={`h-8 w-8 ${theme?.accent || 'text-gray-600'}`} />
                    </div>
                    <p className="text-base font-medium mb-2">No events scheduled</p>
                    <p className="text-sm">Add your first diary entry to see it appear here!</p>
                </div>
            ) : (
                <div className="grid grid-cols-[auto_1fr] gap-x-2">
                    {/* Time column */}
                    <div className="flex flex-col">
                        {hours.map(hour => (
                            <div key={hour} className="h-20 flex justify-end items-start pt-1">
                               <span className="text-xs text-muted-foreground -mt-2.5 pr-2">
                                    {hour > 12 ? hour - 12 : hour}{hour >= 12 ? ' PM' : ' AM'}
                               </span>
                            </div>
                        ))}
                    </div>

                    {/* Events grid */}
                    <div className="relative col-start-2 grid">
                        {/* Hour lines */}
                        {hours.map(hour => (
                            <div key={`line-${hour}`} className={`h-20 border-t border-dashed ${theme?.border || 'border-gray-200'} -ml-2`} />
                        ))}
                        
                        {/* Event items */}
                        {events.map(event => {
                            const startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60;
                            const duration = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60);

                            // Ensure duration is at least 0.5 for visibility
                            const visibleDuration = Math.max(duration, 0.5);

                            const top = (startHour - 8) * 5; // 5rem (h-20) per hour
                            const height = visibleDuration * 5; // 5rem per hour

                            if (top < 0 || top > (13*5)) return null; // Only show events within the 8am-8pm range

                            return (
                                <div
                                    key={event.id}
                                    className={`absolute left-1 right-1 ${theme?.secondary || 'bg-gray-50'} border-l-4 ${theme?.border || 'border-gray-300'} p-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200`}
                                    style={{ 
                                        top: `${top}rem`, 
                                        height: `${height}rem`,
                                        borderLeftColor: theme?.accent?.includes('purple') ? '#8b5cf6' : 
                                                        theme?.accent?.includes('green') ? '#10b981' :
                                                        theme?.accent?.includes('blue') ? '#3b82f6' : '#6b7280'
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className={`font-semibold text-sm ${theme?.accent || 'text-gray-900'}`}>
                                                {event.title}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">
                                                    {format(event.startTime, "HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                        {curriculum && (
                                            <Badge variant="outline" className={`text-xs ${theme?.badge || 'bg-gray-100'}`}>
                                                {curriculum}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

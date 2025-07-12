
"use client"

import { format } from "date-fns"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { useEffect, useState } from "react"

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
        <Card className="p-4 relative h-[500px] overflow-y-auto">
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
                        <div key={`line-${hour}`} className="h-20 border-t border-dashed -ml-2" />
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
                                className="absolute left-1 right-1 bg-primary/10 border-l-4 border-primary p-2 rounded-md shadow-sm"
                                style={{ top: `${top}rem`, height: `${height}rem` }}
                            >
                                <p className="font-semibold text-sm text-primary">{event.title}</p>
                                <p className="text-xs text-primary/80">
                                    {format(event.startTime, "HH:mm")}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}

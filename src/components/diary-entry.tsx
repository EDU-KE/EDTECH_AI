
"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar as CalendarIcon, Clock, Loader2, Save, FolderClock, PenTool, CheckCircle } from "lucide-react"
import { format, set } from "date-fns"
import { useTransition, useEffect } from "react"
import { addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme"

export const diaryEntrySchema = z.object({
  notes: z.string().min(10, "Please enter at least 10 characters for your notes."),
  activity: z.string().min(3, "Please enter an activity name."),
  dateTime: z.date({
    required_error: "A date and time is required.",
  }),
})
export type DiaryEntryData = z.infer<typeof diaryEntrySchema>;

interface DiaryEntryProps {
    onSave: (data: DiaryEntryData) => void;
    onViewSaved: () => void;
    onPlanChange: (plan: string) => void;
}

export function DiaryEntry({ onSave, onViewSaved, onPlanChange }: DiaryEntryProps) {
    const [isPending, startTransition] = useTransition()
    const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme()
    
    const form = useForm<DiaryEntryData>({
        resolver: zodResolver(diaryEntrySchema),
        defaultValues: {
            notes: "",
            activity: "",
            // Initialize with a value to be controlled
            dateTime: new Date(),
        },
    })

    // Set the date only on the client-side after mounting to avoid hydration mismatch
    useEffect(() => {
        form.setValue("dateTime", new Date());
    }, [form]);


    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        form.setValue("notes", value);
        if (value.trim().length >= 15) {
            onPlanChange(value);
        }
    };

    const onSubmit = (data: DiaryEntryData) => {
        startTransition(() => {
            onSave(data)
            form.reset({ notes: '', activity: '', dateTime: new Date() });
            const adviceContainer = document.getElementById("ai-advice-container");
            if(adviceContainer) {
                adviceContainer.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <p>Entry saved! Start typing a new plan to get more advice.</p>
                </div>`;
            }
        })
    }

  return (
    <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
            <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
                <PenTool className={`h-5 w-5 ${theme?.accent || 'text-gray-600'}`} />
                New Diary Entry
                {curriculum && (
                    <Badge variant="outline" className={`ml-2 ${theme?.badge || 'bg-gray-100'}`}>
                        {curriculum}
                    </Badge>
                )}
            </CardTitle>
            <CardDescription>
                Log your thoughts and schedule activities. {curriculumInfo ? `Tailored for ${curriculumInfo.name}` : 'AI will provide tips as you type.'}
            </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 p-6">
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`font-medium ${theme?.accent || 'text-gray-900'}`}>
                                    Today's Plan & Notes
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="What's on your mind? What do you need to do today?"
                                        className={`resize-y min-h-[150px] focus:ring-2 ${theme?.ring || 'focus:ring-gray-500'} ${theme?.border || 'border-gray-200'}`}
                                        {...field}
                                        onChange={handleNotesChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="activity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`font-medium ${theme?.accent || 'text-gray-900'}`}>
                                    Schedule a Task
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="e.g., Study for Math Test, Review Biology Notes" 
                                        className={`focus:ring-2 ${theme?.ring || 'focus:ring-gray-500'} ${theme?.border || 'border-gray-200'}`}
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                     <FormField
                        control={form.control}
                        name="dateTime"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className={`font-medium ${theme?.accent || 'text-gray-900'}`}>
                                Date & Time
                            </FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                        theme?.border || 'border-gray-200',
                                        theme?.hover || 'hover:bg-gray-50'
                                    )}
                                >
                                    {field.value ? (
                                    format(field.value, "PPP, HH:mm")
                                    ) : (
                                    <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < addDays(new Date(), -1) || date > addDays(new Date(), 30)}
                                    initialFocus
                                />
                                <div className="p-2 border-t border-border">
                                    <Controller
                                        name="dateTime"
                                        control={form.control}
                                        render={({ field: timeField }) => (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <Input
                                                    type="time"
                                                    value={timeField.value ? format(timeField.value, "HH:mm") : ''}
                                                    onChange={(e) => {
                                                        const [hours, minutes] = e.target.value.split(':').map(Number);
                                                        const newDate = set(timeField.value || new Date(), { hours, minutes });
                                                        timeField.onChange(newDate);
                                                    }}
                                                    className={`focus:ring-2 ${theme?.ring || 'focus:ring-gray-500'}`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="flex justify-between p-6 pt-0">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className={`${theme?.primary || 'bg-gray-900'} hover:opacity-90 text-white border-0`}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Save & Schedule
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onViewSaved}
                        className={`${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'}`}
                    >
                        <FolderClock className="mr-2 h-4 w-4" />
                        View Saved
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  )
}

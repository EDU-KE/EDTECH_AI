
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { subjects } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const enrollmentSchema = z.object({
  gradeLevel: z.string({
    required_error: "Please select your grade level.",
  }),
  subjects: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one subject to enroll.",
  }),
});

const gradeLevels = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8",
    "Form 1 (Freshman)", "Form 2 (Sophomore)", "Form 3 (Junior)", "Form 4 (Senior)",
    "College / University",
    "Other"
]

export default function EnrollmentPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof enrollmentSchema>>({
        resolver: zodResolver(enrollmentSchema),
        defaultValues: {
            subjects: [],
        },
    });

    useEffect(() => {
        const storedSubjectIds = localStorage.getItem("enrolledSubjects");
        if (storedSubjectIds) {
            form.setValue("subjects", JSON.parse(storedSubjectIds));
        }
    }, [form]);

    function onSubmit(data: z.infer<typeof enrollmentSchema>) {
        localStorage.setItem("enrolledSubjects", JSON.stringify(data.subjects));
        toast({
            title: "Enrollment Successful!",
            description: `You have been enrolled in ${data.subjects.length} subjects for ${data.gradeLevel}.`,
        });
        router.push("/dashboard");
    }

    return (
        <AppShell title="Subject Enrollment">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Enroll in Subjects</CardTitle>
                    <CardDescription>Select your grade level and the subjects you want to study. Your changes will be saved.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <CardContent className="space-y-8">
                             <FormField
                                control={form.control}
                                name="gradeLevel"
                                render={({ field }) => (
                                    <FormItem className="max-w-sm">
                                        <FormLabel>Grade Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your grade or form" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {gradeLevels.map(level => (
                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subjects"
                                render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Available Subjects</FormLabel>
                                        <FormMessage />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {subjects.map((item) => (
                                            <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="subjects"
                                            render={({ field }) => {
                                                const Icon = item.Icon;
                                                return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <Card className="w-full transition-colors hover:bg-muted/50 data-[state=checked]:border-primary">
                                                        <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="h-5 w-5 text-muted-foreground" />
                                                                <FormLabel className="font-normal cursor-pointer">
                                                                    {item.title}
                                                                </FormLabel>
                                                            </div>
                                                            <FormControl>
                                                                <Checkbox
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                        (value) => value !== item.id
                                                                        )
                                                                    );
                                                                }}
                                                                />
                                                            </FormControl>
                                                        </CardHeader>
                                                    </Card>
                                                </FormItem>
                                                );
                                            }}
                                            />
                                        ))}
                                    </div>
                                </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">
                                <BookCheck className="mr-2 h-4 w-4" />
                                Save Enrollment
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </AppShell>
    )
}

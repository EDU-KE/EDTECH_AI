"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
    BookOpen, 
    Clock, 
    Target, 
    TrendingUp, 
    Calendar,
    Star,
    Trophy,
    Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface LibraryAnalyticsProps {
    userId: string;
}

export function LibraryAnalytics({ userId }: LibraryAnalyticsProps) {
    // Mock data for analytics
    const readingStats = {
        booksRead: 12,
        totalPages: 2847,
        averageRating: 4.2,
        readingStreak: 7,
        weeklyGoal: 5,
        weeklyProgress: 3
    };

    const readingHistory = [
        { month: 'Jan', books: 8, pages: 1200 },
        { month: 'Feb', books: 6, pages: 980 },
        { month: 'Mar', books: 10, pages: 1450 },
        { month: 'Apr', books: 12, pages: 1680 },
        { month: 'May', books: 15, pages: 2100 },
        { month: 'Jun', books: 9, pages: 1320 }
    ];

    const subjectDistribution = [
        { name: 'Mathematics', value: 30, color: '#8884d8' },
        { name: 'Science', value: 25, color: '#82ca9d' },
        { name: 'Literature', value: 20, color: '#ffc658' },
        { name: 'History', value: 15, color: '#ff7300' },
        { name: 'Other', value: 10, color: '#00ff00' }
    ];

    const achievements = [
        { title: 'Speed Reader', description: 'Read 5 books in a week', earned: true, icon: '🏃‍♂️' },
        { title: 'Knowledge Seeker', description: 'Complete 3 different subjects', earned: true, icon: '🔍' },
        { title: 'Night Owl', description: 'Read for 2 hours after 10 PM', earned: false, icon: '🦉' },
        { title: 'Early Bird', description: 'Read before 7 AM for 5 days', earned: false, icon: '🐦' }
    ];

    const recentActivity = [
        { action: 'Completed', book: 'Algebra & Trigonometry', time: '2 hours ago' },
        { action: 'Bookmarked', book: 'Biology: A Global Approach', time: '4 hours ago' },
        { action: 'Rated', book: 'The Great Gatsby', time: '1 day ago' },
        { action: 'Started', book: 'A Brief History of Time', time: '2 days ago' }
    ];

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Books Read</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readingStats.booksRead}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readingStats.totalPages.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            ~142 hours of reading
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readingStats.averageRating}</div>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < Math.floor(readingStats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readingStats.readingStreak}</div>
                        <p className="text-xs text-muted-foreground">
                            days in a row
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reading Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Weekly Reading Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Books this week</span>
                                <span className="text-sm font-medium">
                                    {readingStats.weeklyProgress} / {readingStats.weeklyGoal}
                                </span>
                            </div>
                            <Progress 
                                value={(readingStats.weeklyProgress / readingStats.weeklyGoal) * 100} 
                                className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                                {readingStats.weeklyGoal - readingStats.weeklyProgress} more books to reach your goal
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Subject Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reading by Subject</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subjectDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {subjectDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Reading History Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Reading History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={readingHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="books" orientation="left" />
                                    <YAxis yAxisId="pages" orientation="right" />
                                    <Tooltip />
                                    <Bar yAxisId="books" dataKey="books" fill="#8884d8" name="Books" />
                                    <Line 
                                        yAxisId="pages" 
                                        type="monotone" 
                                        dataKey="pages" 
                                        stroke="#82ca9d" 
                                        strokeWidth={2}
                                        name="Pages"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="text-2xl">{achievement.icon}</div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {achievement.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                    </div>
                                    {achievement.earned && (
                                        <Badge variant="secondary">Earned</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.action}</span> "{activity.book}"
                                        </p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

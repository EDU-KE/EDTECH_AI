"use client"

import { AppShell } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leaderboardData } from "@/lib/mock-data";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { 
  Crown, 
  Medal, 
  Award, 
  Trophy, 
  TrendingUp, 
  Star, 
  Zap,
  Users,
  Target,
  Sparkles,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Calendar,
  BarChart3,
  GraduationCap,
  Flame
} from "lucide-react";
import { useState } from "react";

const rankIcons = {
    1: <Crown className="h-6 w-6 text-yellow-500" />,
    2: <Medal className="h-6 w-6 text-gray-400" />,
    3: <Award className="h-6 w-6 text-orange-500" />,
};

const podiumColors = {
  1: "from-yellow-400 to-yellow-600",
  2: "from-gray-300 to-gray-500", 
  3: "from-orange-400 to-orange-600"
};

const levelColors = {
  'Expert': 'bg-purple-100 text-purple-800 border-purple-200',
  'Advanced': 'bg-blue-100 text-blue-800 border-blue-200',
  'Intermediate': 'bg-green-100 text-green-800 border-green-200',
  'Beginner': 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

export default function LeaderboardPage() {
  const { theme, curriculum, curriculumInfo } = useCurriculumTheme();
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("overall");

  const topThree = leaderboardData.slice(0, 3);
  const otherStudents = leaderboardData.slice(3);
  const displayedStudents = showAll ? otherStudents : otherStudents.slice(0, 4);

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${podiumColors[rank as keyof typeof podiumColors]} flex items-center justify-center shadow-lg`}>
          {rankIcons[rank as keyof typeof rankIcons]}
        </div>
      );
    }
    return (
      <div className={`w-10 h-10 rounded-full ${theme?.secondary || 'bg-gray-100'} border-2 ${theme?.border || 'border-gray-200'} flex items-center justify-center font-bold text-sm ${theme?.accent || 'text-gray-700'}`}>
        {rank}
      </div>
    );
  };

  const getProgressToNext = (currentPoints: number, nextPoints?: number) => {
    if (!nextPoints) return 100;
    const progress = (currentPoints / nextPoints) * 100;
    return Math.min(progress, 100);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 20) return 'text-red-600 bg-red-100';
    if (streak >= 15) return 'text-orange-600 bg-orange-100';
    if (streak >= 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <AppShell title="Leaderboard">
      <div className="space-y-6">
        {/* Header with Stats */}
        <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`flex items-center gap-3 text-2xl ${theme?.accent || 'text-gray-900'}`}>
                  <Trophy className={`h-7 w-7 ${theme?.accent || 'text-blue-600'}`} />
                  Learning Champions
                  {curriculum && (
                    <Badge variant="outline" className={`${theme?.badge || 'bg-gray-100'}`}>
                      {curriculumInfo?.icon} {curriculum}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Celebrating our top performers and their learning achievements
                </CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${theme?.accent || 'text-blue-600'}`}>
                  {leaderboardData.length}
                </div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overall Rankings
            </TabsTrigger>
            <TabsTrigger value="streaks" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Learning Streaks
            </TabsTrigger>
            <TabsTrigger value="levels" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              By Level
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-6 mt-6">
            {/* Podium for Top 3 */}
            <Card className={`${theme?.secondary || 'bg-gray-50'} border-2 ${theme?.border || 'border-gray-200'}`}>
              <CardHeader className="text-center pb-4">
                <CardTitle className={`flex items-center justify-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
                  <Sparkles className="h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {/* 2nd Place */}
                  <div className="text-center order-1">
                    <div className="relative mb-4">
                      <div className="h-24 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex items-end justify-center pb-2">
                        <span className="text-white font-bold text-lg">2nd</span>
                      </div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        {getRankBadge(2)}
                      </div>
                    </div>
                    <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-gray-300">
                      <AvatarImage src={topThree[1]?.avatar} alt={topThree[1]?.name} />
                      <AvatarFallback className="text-lg font-bold">{topThree[1]?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{topThree[1]?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{topThree[1]?.grade}</p>
                    <Badge className="bg-gray-100 text-gray-800 text-sm font-bold mb-2">
                      {topThree[1]?.points.toLocaleString()} pts
                    </Badge>
                    <div className="flex justify-center gap-1 flex-wrap">
                      <Badge variant="outline" className={levelColors[topThree[1]?.level as keyof typeof levelColors]}>
                        {topThree[1]?.level}
                      </Badge>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center order-2">
                    <div className="relative mb-4">
                      <div className="h-32 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-end justify-center pb-2 shadow-lg">
                        <span className="text-white font-bold text-xl">1st</span>
                      </div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        {getRankBadge(1)}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-yellow-400 rounded-full p-1">
                          <Star className="h-4 w-4 text-yellow-900 fill-current" />
                        </div>
                      </div>
                    </div>
                    <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-yellow-400 shadow-lg">
                      <AvatarImage src={topThree[0]?.avatar} alt={topThree[0]?.name} />
                      <AvatarFallback className="text-xl font-bold">{topThree[0]?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-xl">{topThree[0]?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{topThree[0]?.grade}</p>
                    <Badge className="bg-yellow-100 text-yellow-800 text-base font-bold mb-2">
                      {topThree[0]?.points.toLocaleString()} pts
                    </Badge>
                    <div className="flex justify-center gap-1 flex-wrap">
                      <Badge variant="outline" className={levelColors[topThree[0]?.level as keyof typeof levelColors]}>
                        {topThree[0]?.level}
                      </Badge>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center order-3">
                    <div className="relative mb-4">
                      <div className="h-20 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex items-end justify-center pb-2">
                        <span className="text-white font-bold text-lg">3rd</span>
                      </div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        {getRankBadge(3)}
                      </div>
                    </div>
                    <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-orange-400">
                      <AvatarImage src={topThree[2]?.avatar} alt={topThree[2]?.name} />
                      <AvatarFallback className="text-lg font-bold">{topThree[2]?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{topThree[2]?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{topThree[2]?.grade}</p>
                    <Badge className="bg-orange-100 text-orange-800 text-sm font-bold mb-2">
                      {topThree[2]?.points.toLocaleString()} pts
                    </Badge>
                    <div className="flex justify-center gap-1 flex-wrap">
                      <Badge variant="outline" className={levelColors[topThree[2]?.level as keyof typeof levelColors]}>
                        {topThree[2]?.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Rankings */}
            <Card className={`border-2 ${theme?.border || 'border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
                  <TrendingUp className="h-5 w-5" />
                  Full Rankings
                </CardTitle>
                <CardDescription>
                  Complete leaderboard with detailed progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Top 3 in list format */}
                {topThree.map((student, index) => (
                  <div 
                    key={student.rank} 
                    className={`p-4 rounded-lg border-2 ${
                      student.rank === 1 ? 'border-yellow-300 bg-yellow-50' :
                      student.rank === 2 ? 'border-gray-300 bg-gray-50' :
                      'border-orange-300 bg-orange-50'
                    } hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getRankBadge(student.rank)}
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{student.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              <span>{student.points.toLocaleString()} points</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{student.grade}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="h-4 w-4" />
                              <span>{student.streak} day streak</span>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            <Badge variant="outline" className={levelColors[student.level as keyof typeof levelColors]}>
                              {student.level}
                            </Badge>
                            {student.badges.slice(0, 2).map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={`text-base font-bold ${
                            student.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            student.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            'bg-orange-100 text-orange-800'
                          }`}
                        >
                          #{student.rank}
                        </Badge>
                        {index < topThree.length - 1 && (
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground">
                              +{(student.points - topThree[index + 1].points).toLocaleString()} ahead
                            </div>
                            <Progress 
                              value={getProgressToNext(topThree[index + 1].points, student.points)} 
                              className="h-1 w-24 mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rest of the rankings */}
                {displayedStudents.map((student, index) => (
                  <div 
                    key={student.rank} 
                    className={`p-3 rounded-lg border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'} transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRankBadge(student.rank)}
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{student.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              <span>{student.points.toLocaleString()} pts</span>
                            </div>
                            <span>{student.grade}</span>
                            <Badge variant="outline" className={`text-xs ${levelColors[student.level as keyof typeof levelColors]}`}>
                              {student.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-sm">
                          #{student.rank}
                        </Badge>
                        {index === 0 && (
                          <div className="mt-1">
                            <div className="text-xs text-muted-foreground">
                              -{(topThree[2].points - student.points).toLocaleString()} behind
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More/Less Button */}
                {otherStudents.length > 4 && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAll(!showAll)}
                      className={`${theme?.hover || 'hover:bg-gray-100'}`}
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Show All {otherStudents.length} Students
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streaks" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Learning Streak Champions
                </CardTitle>
                <CardDescription>
                  Students with the longest consecutive learning streaks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...leaderboardData].sort((a, b) => b.streak - a.streak).map((student, index) => (
                  <div key={student.rank} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                        index === 0 ? 'from-orange-400 to-red-500' :
                        index === 1 ? 'from-orange-300 to-orange-500' :
                        index === 2 ? 'from-yellow-400 to-orange-400' :
                        'from-gray-300 to-gray-400'
                      } flex items-center justify-center text-white font-bold text-sm`}>
                        {index + 1}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.grade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStreakColor(student.streak)} font-bold`}>
                        {student.streak} days
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="levels" className="space-y-6 mt-6">
            <div className="grid gap-6">
              {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map((level) => {
                const studentsInLevel = leaderboardData.filter(s => s.level === level);
                return (
                  <Card key={level}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2`}>
                        <GraduationCap className="h-5 w-5" />
                        {level} Level ({studentsInLevel.length} students)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {studentsInLevel.map((student) => (
                        <div key={student.rank} className="flex items-center justify-between p-2 rounded border">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback className="text-xs">{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.grade}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">#{student.rank}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{student.points.toLocaleString()} pts</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
            <CardContent className="p-4 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${theme?.primary || 'bg-blue-500'} mb-3`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className={`text-2xl font-bold ${theme?.accent || 'text-gray-900'}`}>
                {leaderboardData.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Participants</div>
            </CardContent>
          </Card>

          <Card className={`${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
            <CardContent className="p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 mb-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {topThree[0]?.points.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Highest Score</div>
            </CardContent>
          </Card>

          <Card className={`${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
            <CardContent className="p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(leaderboardData.reduce((sum, s) => sum + s.points, 0) / leaderboardData.length).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>

          <Card className={`${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
            <CardContent className="p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 mb-3">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...leaderboardData.map(s => s.streak))}
              </div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

import { AppShell } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { leaderboardData } from "@/lib/mock-data";
import { Crown, Medal, Award } from "lucide-react";

const rankIcons = {
    1: <Crown className="h-5 w-5 text-yellow-500" />,
    2: <Medal className="h-5 w-5 text-gray-400" />,
    3: <Award className="h-5 w-5 text-yellow-700" />,
};

export default function LeaderboardPage() {
  return (
    <AppShell title="Leaderboard">
      <Card>
        <CardHeader>
          <CardTitle>Top Learners</CardTitle>
          <CardDescription>
            Check out the current standings of our top students. Keep learning to climb the ranks!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((student) => (
                <TableRow key={student.rank} className={student.rank <= 3 ? "font-bold bg-muted/50" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {rankIcons[student.rank as keyof typeof rankIcons]}
                      <span>{student.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.hint} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{student.points.toLocaleString()}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}

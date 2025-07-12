
"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { students as mockStudents } from "@/lib/mock-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ShieldOff, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function StudentsPage() {
    const [students, setStudents] = useState(mockStudents.map(s => ({...s, status: 'Active' as 'Active' | 'Blocked' })))
    const { toast } = useToast()

    const toggleBlockStatus = (studentId: string) => {
        let studentName = '';
        let newStatus: 'Active' | 'Blocked' = 'Active';

        setStudents(currentStudents =>
            currentStudents.map(student => {
                if (student.id === studentId) {
                    newStatus = student.status === 'Active' ? 'Blocked' : 'Active';
                    studentName = student.name;
                    return { ...student, status: newStatus };
                }
                return student;
            })
        );

        if (studentName) {
            toast({
                title: `User ${newStatus}`,
                description: `${studentName} has been ${newStatus.toLowerCase()}.`
            });
        }
    }

  return (
    <AppShell title="Manage Learners">
      <Card>
        <CardHeader>
          <CardTitle>Learner Roster</CardTitle>
          <CardDescription>
            A list of all students currently enrolled. Manage their status and access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.hint} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'Active' ? "secondary" : "destructive"}>
                        {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <UserCheck className="mr-2 h-4 w-4" />
                                View Profile
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => toggleBlockStatus(student.id)}>
                                <ShieldOff className="mr-2 h-4 w-4" />
                                <span>{student.status === 'Active' ? 'Block Learner' : 'Unblock Learner'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
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

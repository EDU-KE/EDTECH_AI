
"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  GraduationCap,
  Menu,
  X,
  type LucideIcon,
  LayoutDashboard,
  BookUser,
  LineChart,
  Activity,
  BookMarked,
  Trophy,
  Swords,
  BotMessageSquare,
  FileSignature,
  BookOpen,
  Search,
  Route,
  Library,
  FileQuestion,
  UsersRound,
  ClipboardEdit,
  Users,
  Shield,
  MessageSquare,
  Presentation,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/user-nav"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { mockNotifications, type MockNotification } from "@/lib/mock-data"
import { NavLink } from "./nav-link"

interface NavGroup {
    title: string;
    items: {
        href: string;
        icon: LucideIcon;
        label: string;
    }[]
}

const mainNav: NavGroup[] = [
    { title: "Student Tools", items: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/subjects/my-subjects", icon: BookUser, label: "My Subjects" },
        { href: "/progress", icon: LineChart, label: "Progress" },
        { href: "/activity", icon: Activity, label: "Activity Tracker" },
        { href: "/diary", icon: BookMarked, label: "Digital Diary" },
        { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
        { href: "/contests", icon: Swords, label: "Contests" },
    ]},
    { title: "AI Features", items: [
        { href: "/tutor", icon: BotMessageSquare, label: "AI Tutor" },
        { href: "/summarizer", icon: FileSignature, label: "AI Notes Assistant" },
        { href: "/learning-path", icon: BookOpen, label: "AI Learning Path" },
        { href: "/research", icon: Search, label: "AI Research Assistant" },
        { href: "/career-path", icon: Route, label: "AI Career Path" },
    ]},
    { title: "Resources", items: [
        { href: "/library", icon: Library, label: "Library Hub" },
        { href: "/exams", icon: FileQuestion, label: "Exams & Revision" },
        { href: "/tutors/online", icon: UsersRound, label: "Online Tutors" },
    ]},
    { title: "Teaching", items: [
        { href: "/class", icon: Presentation, label: "Live Class" },
    ]},
     { title: "Communication", items: [
        { href: "/chat", icon: MessageSquare, label: "Chat" },
    ]},
    { title: "Admin Tools", items: [
        { href: "/tutor-tools", icon: ClipboardEdit, label: "Tutor Tools" },
        { href: "/students", icon: Users, label: "Manage Learners" },
        { href: "/admin", icon: Shield, label: "Admin Panel" },
    ]},
];


interface AppShellClientProps {
  title: string;
}

export function AppShellClient({ title }: AppShellClientProps) {
  const [notifications, setNotifications] = React.useState<MockNotification[]>(mockNotifications);

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  }

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
        <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl font-headline truncate">{title}</h1>
        </div>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-8 w-8 shrink-0">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                )}
                <span className="sr-only">Notifications</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 sm:w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} onSelect={(e) => e.preventDefault()} className="flex items-start justify-between gap-2 whitespace-normal p-3">
                        <div className="flex flex-col space-y-1 min-w-0">
                            <p className="font-medium text-sm leading-snug">{notification.title}</p>
                            <p className="text-xs text-muted-foreground leading-snug">{notification.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => dismissNotification(notification.id)}>
                        <X className="h-4 w-4" />
                        </Button>
                    </DropdownMenuItem>
                ))
            ) : (
                <p className="p-4 text-sm text-center text-muted-foreground">No new notifications</p>
            )}
        </DropdownMenuContent>
        </DropdownMenu>
    </header>
  )
}


"use client";

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  BookOpen,
  BotMessageSquare,
  ClipboardEdit,
  FileQuestion,
  FileSignature,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Menu,
  Swords,
  Trophy,
  Users,
  UsersRound,
  BookUser,
  Route,
  Library,
  Search,
  Shield,
  BookMarked,
  MessageSquare,
  Presentation,
} from "lucide-react"
import { useRouter } from 'next/navigation';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/user-nav"
import { Footer } from "./footer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { NavLink } from "./nav-link";
import { AppShellClient } from "./app-shell-client";
import { useSessionTimeout } from "@/hooks/use-session-timeout";
import { SessionTimeoutDialog } from "./session-timeout-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

interface AppShellProps {
  children: React.ReactNode
  title: string
}

const mainNav = [
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

export function AppShell({ children, title }: AppShellProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleSessionTimeout = React.useCallback(async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Session timeout logout failed:', error);
      // Fallback: still redirect even if logout fails
      router.push('/');
    }
  }, [router]);

  const { isIdle, reset, countdown } = useSessionTimeout({
    onLogout: handleSessionTimeout,
  });

  // Don't show session timeout for logged out users
  const shouldShowTimeout = isIdle && !!user;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <SessionTimeoutDialog
        isOpen={shouldShowTimeout}
        countdown={countdown}
        onStay={() => reset()}
        onLogout={handleSessionTimeout}
      />
      
      {/* Mobile Navigation Sheet */}
      <Sheet>
        <div className="flex flex-col md:hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <div className="flex-1">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-sm">EdTech AI</span>
              </Link>
            </div>
            <UserNav />
          </header>
        </div>
        <SheetContent side="left" className="flex flex-col p-0 w-64">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>EdTech AI Hub</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              {mainNav.map((group, index) => (
                <React.Fragment key={group.title}>
                  {index > 0 && <div className="border-t my-2" />}
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">{group.title}</p>
                  {group.items.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavLink key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent rounded-md">
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    )
                  })}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>EdTech AI Hub</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {mainNav.map((group, index) => (
                <React.Fragment key={group.title}>
                  {index > 0 && <DropdownMenuSeparator className="my-2" />}
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">{group.title}</p>
                  {group.items.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavLink key={item.href} href={item.href}>
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    )
                  })}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col">
        <AppShellClient title={title} />
        <main className="flex flex-1 flex-col p-2 sm:p-4 lg:p-4 bg-background">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

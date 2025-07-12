
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Timer } from "lucide-react";

interface SessionTimeoutDialogProps {
  isOpen: boolean;
  countdown: number;
  onStay: () => void;
  onLogout: () => void;
}

export function SessionTimeoutDialog({
  isOpen,
  countdown,
  onStay,
  onLogout,
}: SessionTimeoutDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Are you still there?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session is about to expire due to inactivity. You will be logged
            out in {countdown} seconds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onStay}>Stay Logged In</AlertDialogCancel>
          <AlertDialogAction onClick={onLogout} className="bg-destructive hover:bg-destructive/90">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CurriculumSelectionModal } from '@/components/CurriculumSelectionModal';
import { getUserProfile, getCurriculumInfo, type UserProfile } from '@/lib/auth';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Settings, BookOpen, User } from 'lucide-react';
import Link from 'next/link';

export default function CurriculumTestPage() {
  const { user, signIn, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserProfile = async () => {
    if (user?.uid) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('student@demo.com', 'password123');
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserProfile(null);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const handleModalComplete = () => {
    setShowModal(false);
    loadUserProfile(); // Refresh profile after curriculum selection
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Curriculum Selection Demo</h1>
        <p className="text-muted-foreground">
          Test the curriculum selection feature for the EdTech platform.
        </p>
      </div>

      {/* Authentication Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Logged in as:</p>
                <p className="font-medium">{user.displayName} ({user.email})</p>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Please log in to test the curriculum selection feature.
              </p>
              <Button onClick={handleDemoLogin} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Demo Login (student@demo.com)'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Profile Section */}
      {user && userProfile && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Current Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <Badge variant="default">{userProfile.role}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Curriculum</p>
                {userProfile.curriculum ? (
                  <Badge variant="secondary">
                    {getCurriculumInfo(userProfile.curriculum).name}
                  </Badge>
                ) : (
                  <Badge variant="outline">Not Selected</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Grade Level</p>
                {userProfile.gradeLevel ? (
                  <Badge variant="outline">{userProfile.gradeLevel}</Badge>
                ) : (
                  <Badge variant="outline">Not Selected</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions Section */}
      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setShowModal(true)}>
                Open Curriculum Selection
              </Button>
              <Button asChild variant="outline">
                <Link href="/settings/curriculum">
                  Curriculum Settings Page
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/firebase-setup">
                  Firebase Setup Guide
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/debug">
                  Firebase Debug Console
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Description */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Automatic Curriculum Selection</h4>
              <p className="text-sm text-muted-foreground">
                When a new user logs in for the first time (or if they haven't selected a curriculum), 
                the system automatically shows the curriculum selection modal.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Available Curricula</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>CBE</strong>: Competency-Based Education (Modern skills-focused approach)</li>
                <li>• <strong>8-4-4</strong>: Traditional Kenyan education system</li>
                <li>• <strong>IGCSE</strong>: International General Certificate of Secondary Education</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Personalized Experience</h4>
              <p className="text-sm text-muted-foreground">
                Based on the selected curriculum and grade level, the system can provide:
                tailored content, appropriate assessments, relevant subjects, and customized learning paths.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Selection Modal */}
      <CurriculumSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleModalComplete}
      />
    </div>
  );
}

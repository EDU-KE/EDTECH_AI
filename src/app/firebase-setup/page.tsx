'use client';

import { FirebaseSetupGuide } from '@/components/FirebaseSetupGuide';

export default function FirebaseSetupPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Firebase Setup Guide</h1>
        <p className="text-muted-foreground">
          Configure Firebase authentication for Google sign-in to work properly.
        </p>
      </div>
      
      <FirebaseSetupGuide />
    </div>
  );
}

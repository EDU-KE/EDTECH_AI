"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { signInWithGoogle, signInWithTwitter } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SocialAuthTest() {
  const { toast } = useToast()
  const { isDemoMode } = useAuth()
  const [testResults, setTestResults] = useState<Record<string, 'idle' | 'testing' | 'success' | 'error'>>({
    google: 'idle',
    twitter: 'idle'
  })

  const testGoogleAuth = async () => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Google authentication requires Firebase configuration.",
        variant: "destructive"
      })
      return
    }

    setTestResults(prev => ({ ...prev, google: 'testing' }))
    try {
      await signInWithGoogle()
      setTestResults(prev => ({ ...prev, google: 'success' }))
      toast({
        title: "Google Auth Test Successful!",
        description: "Google authentication is working correctly.",
      })
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, google: 'error' }))
      toast({
        title: "Google Auth Test Failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const testTwitterAuth = async () => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Twitter authentication requires Firebase configuration.",
        variant: "destructive"
      })
      return
    }

    setTestResults(prev => ({ ...prev, twitter: 'testing' }))
    try {
      await signInWithTwitter()
      setTestResults(prev => ({ ...prev, twitter: 'success' }))
      toast({
        title: "Twitter Auth Test Successful!",
        description: "Twitter authentication is working correctly.",
      })
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, twitter: 'error' }))
      toast({
        title: "Twitter Auth Test Failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Social Authentication Test</CardTitle>
        <CardDescription>
          Test your Google and Twitter authentication setup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Google Authentication</span>
            {getStatusIcon(testResults.google)}
          </div>
          <Button 
            onClick={testGoogleAuth}
            disabled={testResults.google === 'testing' || isDemoMode}
            variant="outline"
            className="w-full"
          >
            {testResults.google === 'testing' ? 'Testing...' : 'Test Google Auth'}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Twitter Authentication</span>
            {getStatusIcon(testResults.twitter)}
          </div>
          <Button 
            onClick={testTwitterAuth}
            disabled={testResults.twitter === 'testing' || isDemoMode}
            variant="outline"
            className="w-full"
          >
            {testResults.twitter === 'testing' ? 'Testing...' : 'Test Twitter Auth'}
          </Button>
        </div>

        {isDemoMode && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
            <p className="font-medium text-yellow-800">Demo Mode Active</p>
            <p className="text-yellow-700">Configure Firebase to test social authentication.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

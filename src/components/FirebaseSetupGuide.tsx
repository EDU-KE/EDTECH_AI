'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function FirebaseSetupGuide() {
  const [currentDomain, setCurrentDomain] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentDomain(window.location.hostname);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Domain copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getEnvironmentInfo = () => {
    const domain = currentDomain;
    
    if (domain === 'localhost') {
      return {
        type: 'Local Development',
        description: 'You\'re running on localhost',
        color: 'bg-blue-50 border-blue-200',
        icon: '💻'
      };
    } else if (domain.includes('github.dev') || domain.includes('gitpod') || domain.includes('codespace')) {
      return {
        type: 'Cloud Development',
        description: 'You\'re running in a cloud development environment',
        color: 'bg-purple-50 border-purple-200',
        icon: '☁️'
      };
    } else {
      return {
        type: 'Production/Custom Domain',
        description: 'You\'re running on a custom domain',
        color: 'bg-green-50 border-green-200',
        icon: '🌐'
      };
    }
  };

  const envInfo = getEnvironmentInfo();

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Firebase Configuration Required</AlertTitle>
        <AlertDescription className="text-amber-700">
          Google sign-in is not working because your current domain is not authorized in Firebase.
        </AlertDescription>
      </Alert>

      <Card className={envInfo.color}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{envInfo.icon}</span>
            {envInfo.type}
          </CardTitle>
          <CardDescription>{envInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Domain:</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{currentDomain}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(currentDomain)}
                  className="h-7"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔧 How to Fix This</CardTitle>
          <CardDescription>
            Follow these steps to authorize your domain in Firebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <p className="font-medium">Open Firebase Console</p>
                  <p className="text-sm text-muted-foreground">Go to your Firebase project console</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Open Firebase Console
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <p className="font-medium">Navigate to Authentication Settings</p>
                  <p className="text-sm text-muted-foreground">
                    Go to: <code className="bg-gray-100 px-1 rounded">Authentication → Settings → Authorized domains</code>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <p className="font-medium">Add Your Domain</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Add domain" and add: <code className="bg-gray-100 px-1 rounded">{currentDomain}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</div>
                <div>
                  <p className="font-medium">Save and Test</p>
                  <p className="text-sm text-muted-foreground">
                    Save the changes and try Google sign-in again
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Common Domains to Add</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li><code>localhost</code> - For local development</li>
                  <li><code>127.0.0.1</code> - Alternative localhost</li>
                  <li>Your production domain (e.g., <code>yourdomain.com</code>)</li>
                  <li>Your Codespace/Gitpod domain if using cloud development</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🛠️ Alternative: Use Demo Mode</CardTitle>
          <CardDescription>
            If you don't want to configure Firebase right now, you can use the demo authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Demo mode allows you to test the application without setting up Firebase. 
            Use these credentials:
          </p>
          <div className="bg-gray-50 p-3 rounded space-y-2">
            <div><strong>Student:</strong> <code>student@demo.com</code> / <code>password123</code></div>
            <div><strong>Teacher:</strong> <code>teacher@demo.com</code> / <code>password123</code></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

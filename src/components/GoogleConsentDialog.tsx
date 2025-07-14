'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Eye, UserCheck, Mail } from "lucide-react"

interface GoogleConsentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
  onDecline: () => void
}

export function GoogleConsentDialog({ 
  open, 
  onOpenChange, 
  onAccept, 
  onDecline 
}: GoogleConsentDialogProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToData, setAgreedToData] = useState(false)

  const canProceed = agreedToTerms && agreedToData

  const handleAccept = () => {
    if (canProceed) {
      onAccept()
      onOpenChange(false)
    }
  }

  const handleDecline = () => {
    onDecline()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Google Account Access
          </DialogTitle>
          <DialogDescription>
            EdTech AI Hub would like to access your Google account to provide a seamless experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Data Usage Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              What we'll access:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <UserCheck className="h-3 w-3" />
                Your basic profile information (name, profile picture)
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Your email address for account creation
              </li>
            </ul>
          </div>

          {/* How we use the data */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">How we use your data:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Create and manage your EdTech AI Hub account</li>
              <li>• Personalize your learning experience</li>
              <li>• Provide customer support when needed</li>
              <li>• Send important account and educational updates</li>
            </ul>
          </div>

          {/* Data Protection */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Your data is protected:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• We never share your personal information with third parties</li>
              <li>• Your data is encrypted and stored securely</li>
              <li>• You can delete your account and data at any time</li>
              <li>• We comply with GDPR and privacy regulations</li>
            </ul>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to EdTech AI Hub's{" "}
                <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="data-usage" 
                checked={agreedToData}
                onCheckedChange={(checked) => setAgreedToData(checked as boolean)}
              />
              <label htmlFor="data-usage" className="text-sm leading-relaxed">
                I consent to EdTech AI Hub accessing my Google account information as described above
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleDecline}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!canProceed}
            className="flex-1"
          >
            Continue with Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

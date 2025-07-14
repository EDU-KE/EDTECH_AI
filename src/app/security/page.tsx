"use client"

import { SecurityMonitor } from "@/components/security/SecurityMonitor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Lock, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Server,
  Zap,
  FileText,
  Settings
} from "lucide-react"

export default function SecurityDashboard() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Security Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive security monitoring and protection status
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Security Settings
        </Button>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitor" className="gap-2">
            <Eye className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="protection" className="gap-2">
            <Shield className="h-4 w-4" />
            Protection
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <FileText className="h-4 w-4" />
            Security Logs
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor">
          <SecurityMonitor />
        </TabsContent>

        <TabsContent value="protection" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* URL Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  URL Protection
                </CardTitle>
                <CardDescription>
                  Advanced URL validation and threat detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SQL Injection Protection</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">XSS Protection</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Path Traversal Protection</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Command Injection Protection</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Rate Limiting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Rate Limiting
                </CardTitle>
                <CardDescription>
                  Request rate limiting and DDoS protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rate Limit</span>
                  <Badge variant="outline">120/min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Window</span>
                  <Badge variant="outline">60 seconds</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-blocking</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security Headers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-500" />
                  Security Headers
                </CardTitle>
                <CardDescription>
                  HTTP security headers and policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Content Security Policy</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HSTS</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">X-Frame-Options</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    SAMEORIGIN
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">XSS Protection</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Block
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protection Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Protection Summary
              </CardTitle>
              <CardDescription>
                Overview of all active security protections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-800">URL Validation</div>
                  <div className="text-xs text-green-600">100% Protection</div>
                </div>
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-800">Rate Limiting</div>
                  <div className="text-xs text-blue-600">Active Monitoring</div>
                </div>
                <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-purple-800">HTTPS/TLS</div>
                  <div className="text-xs text-purple-600">Secure Transport</div>
                </div>
                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Eye className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-orange-800">Real-time Monitoring</div>
                  <div className="text-xs text-orange-600">24/7 Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Security Event Logs
              </CardTitle>
              <CardDescription>
                Detailed security event history and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <div className="text-sm font-medium">Security logs will appear here</div>
                  <div className="text-xs">Real-time security events are logged and displayed in this section</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure security settings and protection levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Rate Limiting Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Requests per minute:</span>
                        <Badge variant="outline">120</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Window duration:</span>
                        <Badge variant="outline">60 seconds</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Auto-block threshold:</span>
                        <Badge variant="outline">5 violations</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Security Level</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Protection Level:</span>
                        <Badge variant="default">High</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Strict Validation:</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Real-time Blocking:</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium mb-2">Current Configuration Status</div>
                  <div className="text-xs text-muted-foreground">
                    All security features are properly configured and active. The application is protected against common web vulnerabilities including SQL injection, XSS, CSRF, and DDoS attacks.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

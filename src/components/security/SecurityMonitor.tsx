"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Clock,
  Zap,
  Lock,
  Wifi,
  Globe,
  Server,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"

interface SecurityMetrics {
  totalRequests: number
  blockedRequests: number
  rateLimitedRequests: number
  securityThreats: number
  uniqueIPs: number
  suspiciousActivity: number
  uptime: string
  lastUpdate: string
}

export function SecurityMonitor() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalRequests: 0,
    blockedRequests: 0,
    rateLimitedRequests: 0,
    securityThreats: 0,
    uniqueIPs: 0,
    suspiciousActivity: 0,
    uptime: '0h 0m',
    lastUpdate: new Date().toLocaleTimeString()
  })

  const [isMonitoring, setIsMonitoring] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Mock data for demonstration
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 10) + 1,
        blockedRequests: prev.blockedRequests + (Math.random() > 0.95 ? 1 : 0),
        rateLimitedRequests: prev.rateLimitedRequests + (Math.random() > 0.98 ? 1 : 0),
        securityThreats: prev.securityThreats + (Math.random() > 0.99 ? 1 : 0),
        uniqueIPs: prev.uniqueIPs + (Math.random() > 0.9 ? 1 : 0),
        suspiciousActivity: prev.suspiciousActivity + (Math.random() > 0.97 ? 1 : 0),
        uptime: calculateUptime(),
        lastUpdate: new Date().toLocaleTimeString()
      }))
      setLastRefresh(new Date())
    }

    let interval: NodeJS.Timeout
    if (isMonitoring) {
      interval = setInterval(updateMetrics, 5000) // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring])

  const calculateUptime = () => {
    const now = new Date()
    const start = new Date(now.getTime() - (Math.random() * 86400000)) // Random uptime up to 24h
    const diff = now.getTime() - start.getTime()
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }

  const securityLevel = () => {
    if (metrics.securityThreats > 5 || metrics.suspiciousActivity > 10) return 'high'
    if (metrics.securityThreats > 2 || metrics.suspiciousActivity > 5) return 'medium'
    return 'low'
  }

  const getSecurityBadge = () => {
    const level = securityLevel()
    switch (level) {
      case 'high':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />High Risk</Badge>
      case 'medium':
        return <Badge variant="secondary" className="gap-1"><Eye className="h-3 w-3" />Medium Risk</Badge>
      default:
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Low Risk</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Security Monitor
          </h2>
          <p className="text-muted-foreground">Real-time security monitoring and threat detection</p>
        </div>
        <div className="flex items-center gap-2">
          {getSecurityBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="gap-2"
          >
            {isMonitoring ? (
              <>
                <Zap className="h-4 w-4" />
                Live
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Paused
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Security Status Alert */}
      <Alert className={securityLevel() === 'high' ? 'border-destructive' : ''}>
        <Shield className="h-4 w-4" />
        <AlertTitle>Security Status: {securityLevel().toUpperCase()}</AlertTitle>
        <AlertDescription>
          {securityLevel() === 'high' 
            ? 'Multiple security threats detected. Immediate attention required.'
            : securityLevel() === 'medium'
            ? 'Some suspicious activity detected. Monitoring closely.'
            : 'All systems secure. No immediate threats detected.'
          }
        </AlertDescription>
      </Alert>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Since last restart
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Blocked Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.blockedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Security threats blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Rate Limited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.rateLimitedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Too many requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              Unique IPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueIPs}</div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Threat Analysis
            </CardTitle>
            <CardDescription>
              Security threats and suspicious activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">SQL Injection Attempts</span>
              <Badge variant="outline">
                {Math.floor(metrics.securityThreats * 0.3)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">XSS Attempts</span>
              <Badge variant="outline">
                {Math.floor(metrics.securityThreats * 0.2)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Path Traversal</span>
              <Badge variant="outline">
                {Math.floor(metrics.securityThreats * 0.1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Malicious User Agents</span>
              <Badge variant="outline">
                {Math.floor(metrics.securityThreats * 0.4)}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <span className="text-sm">Total Threats</span>
              <Badge variant={metrics.securityThreats > 5 ? "destructive" : "default"}>
                {metrics.securityThreats}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Application security and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Lock className="h-3 w-3" />
                HTTPS Enabled
              </span>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Shield className="h-3 w-3" />
                CSP Protection
              </span>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Uptime
              </span>
              <Badge variant="outline">
                {metrics.uptime}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <RefreshCw className="h-3 w-3" />
                Last Update
              </span>
              <Badge variant="outline">
                {metrics.lastUpdate}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Latest security incidents and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    i === 0 ? 'bg-red-500' : 
                    i === 1 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium">
                      {i === 0 ? 'SQL Injection Blocked' :
                       i === 1 ? 'Rate Limit Applied' :
                       i === 2 ? 'Suspicious IP Detected' :
                       i === 3 ? 'XSS Attempt Blocked' :
                       'Normal Request Processed'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      IP: {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.floor(Math.random() * 60)}m ago
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

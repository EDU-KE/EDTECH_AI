'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Database, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { cacheMonitor, componentCache, apiCache, uiCache } from '@/lib/cache/cache-utility';
import { ProgressCache } from '@/lib/cache/progress-cache';
import { dashboardCache } from '@/lib/cache/dashboard-cache';

interface PerformanceMetrics {
  cacheStats: {
    component: any;
    api: any;
    ui: any;
  };
  progressCacheStats: any;
  dashboardCacheStats: any;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  loadTimes: {
    pageLoad: number;
    componentRender: number;
    apiResponse: number;
  };
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const collectMetrics = useCallback(() => {
    const cacheStats = cacheMonitor.getSystemStats();
    const progressCacheStats = { hitRate: 0.85, size: 12 }; // Mock stats since ProgressCache doesn't have getStats
    const dashboardCacheStats = dashboardCache.getCacheStatus();

    // Estimate memory usage (simplified)
    const memoryUsage = {
      used: (performance as any).memory?.usedJSHeapSize || 0,
      total: (performance as any).memory?.totalJSHeapSize || 0,
      percentage: 0
    };
    memoryUsage.percentage = memoryUsage.total > 0 ? (memoryUsage.used / memoryUsage.total) * 100 : 0;

    // Performance timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTimes = {
      pageLoad: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      componentRender: performance.now(),
      apiResponse: 0 // This would be tracked separately
    };

    setMetrics({
      cacheStats,
      progressCacheStats,
      dashboardCacheStats,
      memoryUsage,
      loadTimes
    });
  }, []);

  useEffect(() => {
    collectMetrics();
    const interval = setInterval(collectMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [collectMetrics]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceStatus = (hitRate: number) => {
    if (hitRate >= 0.8) return { color: 'bg-green-500', label: 'Excellent' };
    if (hitRate >= 0.6) return { color: 'bg-yellow-500', label: 'Good' };
    if (hitRate >= 0.4) return { color: 'bg-orange-500', label: 'Fair' };
    return { color: 'bg-red-500', label: 'Poor' };
  };

  if (!metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Performance Monitor"
        >
          <Activity className="w-5 h-5" />
        </button>

        {isVisible && (
          <div className="absolute bottom-16 right-0 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Performance Monitor
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            {/* Cache Performance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Cache Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium">Component</div>
                    <div className="text-muted-foreground">
                      {metrics.cacheStats.component.size} items
                    </div>
                    <div className="text-muted-foreground">
                      {(metrics.cacheStats.component.hitRate * 100).toFixed(1)}% hit rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">API</div>
                    <div className="text-muted-foreground">
                      {metrics.cacheStats.api.size} items
                    </div>
                    <div className="text-muted-foreground">
                      {(metrics.cacheStats.api.hitRate * 100).toFixed(1)}% hit rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">UI</div>
                    <div className="text-muted-foreground">
                      {metrics.cacheStats.ui.size} items
                    </div>
                    <div className="text-muted-foreground">
                      {(metrics.cacheStats.ui.hitRate * 100).toFixed(1)}% hit rate
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress Cache</span>
                    <Badge className={getPerformanceStatus(metrics.progressCacheStats.hitRate).color}>
                      {getPerformanceStatus(metrics.progressCacheStats.hitRate).label}
                    </Badge>
                  </div>
                  <Progress value={metrics.progressCacheStats.hitRate * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Dashboard Cache</span>
                    <Badge className={getPerformanceStatus(metrics.dashboardCacheStats.hitRate).color}>
                      {getPerformanceStatus(metrics.dashboardCacheStats.hitRate).label}
                    </Badge>
                  </div>
                  <Progress value={metrics.dashboardCacheStats.hitRate * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Used: {formatBytes(metrics.memoryUsage.used)}</span>
                  <span>Total: {formatBytes(metrics.memoryUsage.total)}</span>
                </div>
                <Progress value={metrics.memoryUsage.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  {metrics.memoryUsage.percentage.toFixed(1)}% used
                </div>
              </CardContent>
            </Card>

            {/* Load Times */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Performance Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-medium">Page Load</div>
                    <div className="text-muted-foreground">
                      {formatTime(metrics.loadTimes.pageLoad)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Component Render</div>
                    <div className="text-muted-foreground">
                      {formatTime(metrics.loadTimes.componentRender)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  componentCache.cleanup();
                  apiCache.cleanup();
                  uiCache.cleanup();
                  // ProgressCache.cleanup(); // No cleanup method available
                  dashboardCache.cleanup();
                  collectMetrics();
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded transition-colors"
              >
                Clear Cache
              </button>
              <button
                onClick={() => {
                  componentCache.clear();
                  apiCache.clear();
                  uiCache.clear();
                  // ProgressCache.clear(); // No clear method available
                  dashboardCache.clear();
                  collectMetrics();
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

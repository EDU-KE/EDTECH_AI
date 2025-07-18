'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSmartNotifications } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { generateNotificationId, shouldShowNotification, scheduleNotification, getNotificationPriority } from '@/lib/notification-utils';

interface Notification {
  id: string;
  type: 'reminder' | 'encouragement' | 'warning' | 'celebration' | 'suggestion';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionButton?: string;
  actionUrl?: string;
  icon?: string;
  scheduledTime?: string;
}

interface SmartNotificationsProps {
  className?: string;
}

export function SmartNotifications({ className }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);
  const { toast } = useToast();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'encouragement':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'celebration':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'suggestion':
        return <Info className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const result = await getSmartNotifications(formData);
      
      if (result.success && result.data) {
        setNotifications(result.data.notifications);
        setPersonalizedMessage(result.data.personalizedMessage);
        setActionItems(result.data.actionItems);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to fetch notifications'
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch smart notifications'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    dismissNotification(notification.id);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <CardTitle>Smart Notifications</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNotifications}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        <CardDescription>
          AI-powered personalized learning notifications
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Personalized Message */}
        {personalizedMessage && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              {personalizedMessage}
            </p>
          </div>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Recommended Actions:</h4>
            <div className="flex flex-wrap gap-2">
              {actionItems.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications at the moment</p>
              <p className="text-sm">Check back later for personalized updates</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                  notification.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      {notification.actionButton && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(notification)}
                          className="text-xs"
                        >
                          {notification.actionButton}
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

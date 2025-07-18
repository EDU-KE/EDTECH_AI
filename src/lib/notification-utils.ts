// Helper functions for smart notifications
// These are client-side utilities that don't need to be server actions

export function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function shouldShowNotification(notification: any, userPreferences: any): boolean {
  // Logic to determine if notification should be shown based on user preferences
  // This could include checking user notification settings, time preferences, etc.
  return true; // Simplified for now
}

export function scheduleNotification(notification: any): void {
  // Logic to schedule notification for later delivery
  // This could integrate with browser notifications API or a notification service
  console.log('Scheduling notification:', notification.title);
}

export function getNotificationPriority(notification: any): 'low' | 'medium' | 'high' {
  // Determine notification priority based on content
  if (notification.type === 'warning') return 'high';
  if (notification.type === 'reminder') return 'medium';
  return 'low';
}

export function formatNotificationTime(timestamp: string): string {
  // Format notification timestamp for display
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function groupNotificationsByType(notifications: any[]): Record<string, any[]> {
  return notifications.reduce((groups, notification) => {
    const type = notification.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(notification);
    return groups;
  }, {});
}

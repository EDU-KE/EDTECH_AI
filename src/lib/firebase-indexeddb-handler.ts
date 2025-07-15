// Firebase IndexedDB Error Handler Utility
// This utility helps handle IndexedDB corruption issues in Firebase

export class FirebaseIndexedDBHandler {
  private static readonly DB_NAMES = [
    'firebase-heartbeat-database',
    'firebase-installations-database',
    'firestore_last-35eb7_last-35eb7.firebaseapp.com_default',
    'firebase-messaging-database'
  ];

  /**
   * Clear all Firebase-related IndexedDB databases
   */
  static async clearFirebaseIndexedDB(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      console.warn('IndexedDB not available in this environment');
      return;
    }

    console.log('🔧 Clearing Firebase IndexedDB databases...');

    const clearPromises = this.DB_NAMES.map(dbName => {
      return new Promise<void>((resolve) => {
        try {
          const deleteReq = indexedDB.deleteDatabase(dbName);
          deleteReq.onsuccess = () => {
            console.log(`✅ Cleared database: ${dbName}`);
            resolve();
          };
          deleteReq.onerror = () => {
            console.warn(`⚠️ Failed to clear database: ${dbName}`);
            resolve(); // Don't fail the entire operation
          };
        } catch (error) {
          console.warn(`⚠️ Error clearing database ${dbName}:`, error);
          resolve(); // Don't fail the entire operation
        }
      });
    });

    await Promise.all(clearPromises);
    console.log('🔧 Firebase IndexedDB cleanup completed');
  }

  /**
   * Handle IndexedDB corruption error
   */
  static async handleCorruptionError(): Promise<void> {
    console.warn('🚨 IndexedDB corruption detected. Attempting to resolve...');
    
    // Clear corrupted databases
    await this.clearFirebaseIndexedDB();
    
    // Show user notification
    this.showUserNotification();
    
    // Auto-reload after a delay
    setTimeout(() => {
      console.log('🔄 Reloading page to reinitialize Firebase...');
      window.location.reload();
    }, 3000);
  }

  /**
   * Show user-friendly notification about the fix
   */
  private static showUserNotification(): void {
    if (typeof window === 'undefined') return;

    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div style="margin-right: 10px;">🔧</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">Database Fixed</div>
          <div style="font-size: 12px; opacity: 0.9;">
            Cleared corrupted data. Page will reload in 3 seconds...
          </div>
        </div>
      </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * Check if error is related to IndexedDB corruption
   */
  static isIndexedDBCorruptionError(error: any): boolean {
    if (!error || !error.message) return false;
    
    const message = error.message.toLowerCase();
    return message.includes('indexeddb') && 
           (message.includes('corruption') || 
            message.includes('refusing to open') ||
            message.includes('lastcloseddbversion'));
  }
}

// Export utility functions
export const clearFirebaseIndexedDB = FirebaseIndexedDBHandler.clearFirebaseIndexedDB;
export const handleIndexedDBCorruption = FirebaseIndexedDBHandler.handleCorruptionError;
export const isIndexedDBCorruption = FirebaseIndexedDBHandler.isIndexedDBCorruptionError;

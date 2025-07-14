import { useToast } from "@/hooks/use-toast";

// Enhanced auth toast messages
export const useAuthToast = () => {
  const { toast } = useToast();

  const showAuthError = (error: any) => {
    const title = error.title || '❌ Authentication Error';
    const message = error.message || 'An unexpected error occurred';
    const action = error.action;
    const type = error.type || 'error';

    let variant: 'default' | 'destructive' = 'destructive';
    let duration = 8000; // 8 seconds for errors

    // Adjust based on error type
    if (type === 'warning') {
      variant = 'default';
      duration = 6000;
    } else if (type === 'info') {
      variant = 'default';
      duration = 4000;
    }

    // Create description with action tip
    const description = action 
      ? `${message}\n\n💡 Tip: ${action}`
      : message;

    toast({
      variant,
      title,
      description,
      duration,
    });
  };

  const showAuthSuccess = (title: string, message?: string) => {
    toast({
      title: `✅ ${title}`,
      description: message,
      duration: 4000,
    });
  };

  const showAuthInfo = (title: string, message?: string) => {
    toast({
      title: `ℹ️ ${title}`,
      description: message,
      duration: 5000,
    });
  };

  return {
    showAuthError,
    showAuthSuccess,
    showAuthInfo,
  };
};

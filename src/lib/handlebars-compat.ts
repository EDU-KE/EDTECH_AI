// Compatibility layer for handlebars in server environment
// This helps resolve the ES module issue with handlebars in Next.js

if (typeof window === 'undefined') {
  // Server-side only
  const originalRequire = require;
  
  // Override require for handlebars to handle ES module compatibility
  const Module = require('module');
  const originalLoad = Module._load;
  
  Module._load = function(request: string, parent: any) {
    if (request === 'handlebars' || request.includes('handlebars')) {
      try {
        const handlebars = originalLoad.apply(this, arguments);
        // Ensure handlebars is properly exported
        if (handlebars && typeof handlebars.create === 'function') {
          return handlebars;
        }
        return handlebars.default || handlebars;
      } catch (error: any) {
        console.warn('Handlebars compatibility layer error:', error?.message || 'Unknown error');
        return originalLoad.apply(this, arguments);
      }
    }
    return originalLoad.apply(this, arguments);
  };
}

export {};

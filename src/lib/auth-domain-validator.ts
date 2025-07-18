import { auth } from './firebase';

export const validateAuthDomain = (): boolean => {
  const hostname = window.location.hostname;
  const config = auth.app.options;
  
  // Authorized domains for authentication
  const validDomains = [
    'localhost',
    '127.0.0.1',
    'githubpreview.dev',
    'app.github.dev',
    'github.dev',
    config.authDomain
  ];
  
  // Check if current domain matches any valid domain pattern
  const isValid = validDomains.some(domain => 
    hostname === domain || 
    hostname.endsWith(`.${domain}`) ||
    hostname.includes('-3000.') // Allow Codespace preview URLs
  );
  
  if (!isValid) {
    console.error(`Domain ${hostname} is not authorized for Firebase authentication.`);
    console.log('Valid domains:', validDomains);
    console.log('Current auth domain:', config.authDomain);
  }
  
  return isValid;
};

export const getRequiredDomains = (): string[] => {
  const codespaceHost = process.env.CODESPACE_NAME ? 
    `${process.env.CODESPACE_NAME}-3000.app.github.dev` : '';
    
  return [
    'localhost',
    '127.0.0.1',
    codespaceHost,
    '*.githubpreview.dev',
    '*.app.github.dev'
  ].filter(Boolean);
};

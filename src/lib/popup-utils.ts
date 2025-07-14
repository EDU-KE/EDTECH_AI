// Popup blocking detection and helper utilities

export const detectPopupBlocking = (): boolean => {
  try {
    const popup = window.open('', '', 'width=1,height=1');
    if (popup) {
      popup.close();
      return false; // Popups are allowed
    }
    return true; // Popups are blocked
  } catch {
    return true; // Popups are blocked
  }
};

export const getPopupUnblockInstructions = (): string[] => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) {
    return [
      'Click the popup blocked icon in the address bar',
      'Select "Always allow popups from this site"',
      'Click "Done" and try signing in again'
    ];
  } else if (userAgent.includes('Firefox')) {
    return [
      'Click the shield icon in the address bar',
      'Click "Disable Blocking for This Site"',
      'Refresh the page and try again'
    ];
  } else if (userAgent.includes('Safari')) {
    return [
      'Go to Safari > Preferences > Websites',
      'Click "Pop-up Windows" on the left',
      'Set this website to "Allow"'
    ];
  } else if (userAgent.includes('Edge')) {
    return [
      'Click the popup blocked icon in the address bar',
      'Select "Always allow on this site"',
      'Try signing in again'
    ];
  }
  
  return [
    'Look for a popup blocked icon in your browser',
    'Allow popups for this website',
    'Refresh the page and try again'
  ];
};

export const showPopupHelp = (): void => {
  const instructions = getPopupUnblockInstructions();
  const message = [
    'Popups are blocked in your browser.',
    'To enable Google Sign-in:',
    '',
    ...instructions.map((instruction, index) => `${index + 1}. ${instruction}`),
    '',
    'Or use the "Alternative Method" button which doesn\'t require popups.'
  ].join('\n');
  
  alert(message);
};

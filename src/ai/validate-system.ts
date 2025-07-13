/**
 * @fileOverview Startup validation for DeepSeek AI configuration
 * Run this to verify that the system is properly configured for DeepSeek
 */

import { validateDeepSeekConfig } from './deepseek-config';
import { MODEL_CONFIG } from './model-config';

export function validateAISystem(): boolean {
  console.log('🔍 Validating AI System Configuration...\n');
  
  let isValid = true;
  
  // Check DeepSeek API key
  if (!validateDeepSeekConfig()) {
    isValid = false;
  }
  
  // Validate model configuration
  console.log('\n📋 Model Configuration:');
  console.log(`Primary Model: ${MODEL_CONFIG.PRIMARY}`);
  console.log(`Reasoning Model: ${MODEL_CONFIG.REASONING}`);
  console.log(`Creative Model: ${MODEL_CONFIG.CREATIVE}`);
  console.log(`Fast Model: ${MODEL_CONFIG.FAST}`);
  
  if (isValid) {
    console.log('\n🎉 AI System is properly configured for DeepSeek!');
    console.log('✅ Ready to start the development server');
  } else {
    console.log('\n❌ AI System configuration has issues');
    console.log('Please fix the issues above before starting the server');
  }
  
  return isValid;
}

// Auto-run validation if this file is executed directly
if (require.main === module) {
  validateAISystem();
}

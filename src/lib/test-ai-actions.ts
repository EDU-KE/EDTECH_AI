// Test file to verify AI actions work without ES module issues
import { getSubjectAnalysis } from '@/lib/actions';

export async function testAIActions() {
  console.log('Testing AI actions...');
  
  try {
    const formData = new FormData();
    formData.append('subjectTitle', 'Mathematics');
    
    const result = await getSubjectAnalysis(formData);
    console.log('AI Analysis Result:', result);
    
    return { success: true, result };
  } catch (error: any) {
    console.error('AI Actions Error:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

import { getCurriculumInfo } from '@/lib/auth';

// Demonstrate the themed curriculum system
export function demonstrateThemes() {
  const curriculums = ['CBE', '8-4-4', 'IGCSE'] as const;
  
  console.log('🎨 Enhanced Curriculum Themes:');
  console.log('================================');
  
  curriculums.forEach(curriculum => {
    const info = getCurriculumInfo(curriculum);
    console.log(`\n${info.icon} ${info.name}`);
    console.log(`Theme: ${info.theme.primary}`);
    console.log(`Features: ${info.features.join(', ')}`);
    console.log(`Subjects: ${info.subjects.length} total`);
    console.log(`Grade Levels: ${info.grades.length} levels`);
  });
}

// Example usage in components:
export const themeExamples = {
  cbe: {
    cardClass: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
    badgeClass: 'bg-purple-100 text-purple-800',
    hoverClass: 'hover:bg-purple-100',
    features: ['Skills-based learning', 'Real-world applications', 'Project-based assessment']
  },
  traditional: {
    cardClass: 'bg-gradient-to-br from-green-500 to-teal-500 text-white',
    badgeClass: 'bg-green-100 text-green-800',
    hoverClass: 'hover:bg-green-100',
    features: ['Structured learning path', 'Traditional assessments', 'Foundation focused']
  },
  international: {
    cardClass: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white',
    badgeClass: 'bg-blue-100 text-blue-800',
    hoverClass: 'hover:bg-blue-100',
    features: ['Global recognition', 'University preparation', 'International standards']
  }
};

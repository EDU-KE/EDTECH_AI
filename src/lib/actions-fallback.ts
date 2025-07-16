"use server";

// Fallback AI analysis function that works without GenKit when server actions fail
export async function getSubjectAnalysisFallback(formData: FormData) {
  const subjectTitle = formData.get("subjectTitle") as string;
  
  if (!subjectTitle) {
    return { error: "Subject title is required." };
  }

  try {
    // Simulate AI analysis with detailed fallback content
    const analysisTemplates = {
      "Mathematics": `
**Subject Overview: Mathematics**

Mathematics is a fundamental subject that develops logical thinking, problem-solving abilities, and analytical skills. This subject covers various areas including:

**Key Areas:**
- Algebra and Equations
- Geometry and Trigonometry  
- Calculus and Analysis
- Statistics and Probability
- Number Theory

**Learning Benefits:**
- Develops logical reasoning
- Enhances problem-solving skills
- Builds analytical thinking
- Provides foundation for STEM careers
- Improves cognitive abilities

**Study Tips:**
- Practice regularly with diverse problems
- Focus on understanding concepts, not just memorization
- Use visual aids and graphs
- Work through examples step-by-step
- Apply mathematical concepts to real-world scenarios

**Career Applications:**
Mathematics opens doors to careers in engineering, finance, data science, research, education, and technology.
      `,
      "Science": `
**Subject Overview: Science**

Science is an exciting field that explores the natural world through observation, experimentation, and analysis. This subject encompasses:

**Key Areas:**
- Physics (Motion, Energy, Matter)
- Chemistry (Atoms, Molecules, Reactions)
- Biology (Life, Evolution, Ecology)
- Earth Science (Geology, Climate, Environment)

**Learning Benefits:**
- Develops scientific thinking
- Enhances observation skills
- Builds experimental methodology
- Promotes curiosity and innovation
- Provides understanding of natural phenomena

**Study Tips:**
- Conduct hands-on experiments
- Use diagrams and models
- Connect concepts to everyday life
- Practice scientific method
- Read scientific literature

**Career Applications:**
Science leads to careers in research, medicine, environmental science, biotechnology, and engineering.
      `,
      "English": `
**Subject Overview: English**

English develops communication skills, critical thinking, and cultural understanding through literature, writing, and language study.

**Key Areas:**
- Literature Analysis
- Creative Writing
- Grammar and Syntax
- Communication Skills
- Critical Reading

**Learning Benefits:**
- Improves communication skills
- Enhances critical thinking
- Develops cultural awareness
- Builds vocabulary and expression
- Strengthens analytical abilities

**Study Tips:**
- Read diverse literature
- Practice writing regularly
- Engage in discussions
- Analyze texts critically
- Build vocabulary daily

**Career Applications:**
English skills are valuable in journalism, education, law, publishing, marketing, and many other fields.
      `
    };

    // Get specific analysis or generate generic one
    let analysis = analysisTemplates[subjectTitle as keyof typeof analysisTemplates];
    
    if (!analysis) {
      analysis = `
**Subject Overview: ${subjectTitle}**

${subjectTitle} is an important academic subject that contributes to your overall education and personal development.

**Key Learning Areas:**
- Core concepts and theories
- Practical applications
- Critical thinking skills
- Problem-solving techniques
- Real-world relevance

**Study Recommendations:**
- Regular practice and review
- Active participation in class
- Seek help when needed
- Connect learning to personal interests
- Apply knowledge to practical situations

**Benefits:**
- Develops analytical skills
- Enhances knowledge base
- Builds foundation for further study
- Improves cognitive abilities
- Prepares for future opportunities

This subject provides valuable skills and knowledge that will benefit you throughout your academic journey and future career.
      `;
    }

    return { analysis: analysis.trim() };
  } catch (error) {
    console.error('Fallback analysis error:', error);
    return { 
      error: "Unable to generate analysis at this time. Please try again later." 
    };
  }
}

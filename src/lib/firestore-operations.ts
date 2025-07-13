import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  writeBatch,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

// Student Management Operations
export const studentOperations = {
  // Get all students with pagination and filtering
  async getStudents(gradeLevel?: string, status?: string, limitCount = 50) {
    let q = collection(db, 'students');
    
    const constraints: QueryConstraint[] = [];
    if (gradeLevel) constraints.push(where('gradeLevel', '==', gradeLevel));
    if (status) constraints.push(where('status', '==', status));
    constraints.push(orderBy('enrollmentDate', 'desc'));
    constraints.push(limit(limitCount));
    
    const queryRef = query(q, ...constraints);
    const snapshot = await getDocs(queryRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      enrollmentDate: doc.data().enrollmentDate?.toDate(),
      lastActive: doc.data().lastActive?.toDate()
    }));
  },

  // Create new student
  async createStudent(studentData: any) {
    return await addDoc(collection(db, 'students'), {
      ...studentData,
      enrollmentDate: serverTimestamp(),
      lastActive: serverTimestamp(),
      status: 'active'
    });
  },

  // Update student status (block/unblock)
  async updateStudentStatus(studentId: string, status: 'active' | 'blocked') {
    const studentRef = doc(db, 'students', studentId);
    await updateDoc(studentRef, {
      status,
      lastUpdated: serverTimestamp()
    });
  }
};

// Exam Results Operations
export const examOperations = {
  // Get exam results for a student
  async getStudentExamResults(studentId: string, subject?: string) {
    let q = collection(db, 'examResults');
    
    const constraints: QueryConstraint[] = [where('studentId', '==', studentId)];
    if (subject) constraints.push(where('subject', '==', subject));
    constraints.push(orderBy('timestamp', 'desc'));
    
    const queryRef = query(q, ...constraints);
    const snapshot = await getDocs(queryRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  },

  // Get leaderboard for a subject and grade
  async getLeaderboard(subject: string, gradeLevel: string, limitCount = 10) {
    const q = query(
      collection(db, 'examResults'),
      where('subject', '==', subject),
      where('gradeLevel', '==', gradeLevel),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  },

  // Record exam result
  async recordExamResult(examData: {
    studentId: string;
    subject: string;
    gradeLevel: string;
    score: number;
    examTitle: string;
    totalQuestions: number;
    correctAnswers: number;
  }) {
    return await addDoc(collection(db, 'examResults'), {
      ...examData,
      timestamp: serverTimestamp()
    });
  }
};

// Learning Progress Operations
export const progressOperations = {
  // Get learning progress for a user
  async getUserProgress(userId: string, subject?: string) {
    let q = collection(db, 'learningProgress');
    
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];
    if (subject) constraints.push(where('subject', '==', subject));
    constraints.push(orderBy('lastUpdated', 'desc'));
    
    const queryRef = query(q, ...constraints);
    const snapshot = await getDocs(queryRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: doc.data().lastUpdated?.toDate()
    }));
  },

  // Update learning progress
  async updateProgress(userId: string, subject: string, progressData: {
    completionPercentage: number;
    completedModules: string[];
    currentModule: string;
    timeSpent: number;
  }) {
    const progressRef = doc(db, 'learningProgress', `${userId}_${subject}`);
    await updateDoc(progressRef, {
      userId,
      subject,
      ...progressData,
      lastUpdated: serverTimestamp()
    });
  }
};

// Real-time Tutoring Operations
export const tutoringOperations = {
  // Create new tutoring session
  async createTutoringSession(studentId: string, tutorId: string, subject: string) {
    return await addDoc(collection(db, 'tutoringSessions'), {
      studentId,
      tutorId,
      subject,
      status: 'active',
      startTime: serverTimestamp(),
      messages: []
    });
  },

  // Listen to tutoring session messages in real-time
  listenToSessionMessages(sessionId: string, callback: (messages: any[]) => void) {
    const messagesRef = collection(db, 'tutoringSessions', sessionId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      callback(messages);
    });
  },

  // Add message to tutoring session
  async addMessage(sessionId: string, message: {
    senderId: string;
    senderType: 'student' | 'tutor' | 'ai';
    content: string;
    messageType: 'text' | 'image' | 'file';
  }) {
    const messagesRef = collection(db, 'tutoringSessions', sessionId, 'messages');
    return await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp()
    });
  }
};

// Student Activity Tracking
export const activityOperations = {
  // Log student activity
  async logActivity(userId: string, activity: {
    action: string;
    subject: string;
    description: string;
    metadata?: any;
  }) {
    return await addDoc(collection(db, 'studentActivities'), {
      userId,
      ...activity,
      timestamp: serverTimestamp()
    });
  },

  // Get recent activities for a user
  async getUserActivities(userId: string, subject?: string, limitCount = 20) {
    let q = collection(db, 'studentActivities');
    
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];
    if (subject) constraints.push(where('subject', '==', subject));
    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(limit(limitCount));
    
    const queryRef = query(q, ...constraints);
    const snapshot = await getDocs(queryRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  }
};

// Batch Operations for Performance
export const batchOperations = {
  // Batch update multiple documents
  async batchUpdate(updates: Array<{
    collection: string;
    docId: string;
    data: any;
  }>) {
    const batch = writeBatch(db);
    
    updates.forEach(({ collection: collectionName, docId, data }) => {
      const docRef = doc(db, collectionName, docId);
      batch.update(docRef, {
        ...data,
        lastUpdated: serverTimestamp()
      });
    });
    
    return await batch.commit();
  },

  // Batch create multiple documents
  async batchCreate(creates: Array<{
    collection: string;
    data: any;
  }>) {
    const batch = writeBatch(db);
    
    creates.forEach(({ collection: collectionName, data }) => {
      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, {
        ...data,
        createdAt: serverTimestamp()
      });
    });
    
    return await batch.commit();
  }
};

// Optimized queries for common operations
export const optimizedQueries = {
  // Get dashboard data in one efficient query
  async getDashboardData(userId: string) {
    const [progress, recentActivities, examResults] = await Promise.all([
      progressOperations.getUserProgress(userId),
      activityOperations.getUserActivities(userId, undefined, 5),
      examOperations.getStudentExamResults(userId)
    ]);

    return {
      progress,
      recentActivities,
      examResults: examResults.slice(0, 5) // Latest 5 results
    };
  },

  // Get subject overview with all related data
  async getSubjectOverview(userId: string, subject: string) {
    const [progress, activities, examResults] = await Promise.all([
      progressOperations.getUserProgress(userId, subject),
      activityOperations.getUserActivities(userId, subject, 10),
      examOperations.getStudentExamResults(userId, subject)
    ]);

    return {
      progress: progress[0] || null,
      recentActivities: activities,
      examHistory: examResults
    };
  }
};

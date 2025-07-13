# Firestore Optimization Guide for EDTECH_AI

This guide covers the optimized Firestore configuration for your EDTECH_AI project, designed for maximum performance with fast data storing and retrieving.

## 🚀 Quick Start

1. **Run the setup script:**
   ```bash
   ./setup-firestore.sh
   ```

2. **Update your environment variables:**
   ```bash
   # Add to .env file
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

3. **Deploy to Firebase:**
   ```bash
   npm run db:deploy
   ```

## 📊 Performance Optimizations

### Indexes Created
Our configuration creates optimized composite indexes for:

- **Student Management**: `gradeLevel + enrollmentDate`, `status + lastActive`
- **Exam Results**: `studentId + subject + timestamp`, `subject + gradeLevel + score`
- **Learning Progress**: `userId + subject + completionStatus`, `userId + lastUpdated`
- **Tutoring Sessions**: `studentId + status + startTime`
- **Student Activities**: `userId + subject + timestamp`
- **Leaderboard**: `gradeLevel + points`

### Query Performance Expectations

| Operation | Expected Time | Optimized For |
|-----------|---------------|---------------|
| Student Dashboard Load | < 200ms | Real-time experience |
| Subject Progress Fetch | < 100ms | Instant feedback |
| Exam Results Retrieval | < 150ms | Quick analytics |
| Tutoring Session Load | < 50ms | Real-time chat |
| Leaderboard Query | < 100ms | Live rankings |

## 🔧 Usage Examples

### Basic Operations

```typescript
import { studentOperations, examOperations, progressOperations } from '@/lib/firestore-operations';

// Get student dashboard data (optimized single query)
const dashboardData = await optimizedQueries.getDashboardData(userId);

// Get students with filtering
const students = await studentOperations.getStudents('Grade 10', 'active', 50);

// Record exam result
await examOperations.recordExamResult({
  studentId: 'user123',
  subject: 'Mathematics',
  gradeLevel: 'Grade 10',
  score: 85,
  examTitle: 'Algebra Test',
  totalQuestions: 20,
  correctAnswers: 17
});
```

### Real-time Operations

```typescript
import { tutoringOperations } from '@/lib/firestore-operations';

// Listen to tutoring session messages
const unsubscribe = tutoringOperations.listenToSessionMessages(
  sessionId,
  (messages) => {
    console.log('New messages:', messages);
  }
);

// Add message to session
await tutoringOperations.addMessage(sessionId, {
  senderId: 'user123',
  senderType: 'student',
  content: 'I need help with calculus',
  messageType: 'text'
});
```

### Performance Monitoring

```typescript
import { FirestorePerformanceMonitor } from '@/lib/firestore-performance';

const monitor = FirestorePerformanceMonitor.getInstance();

// Monitor a query
const result = await monitor.monitoredQuery('getStudentProgress', async () => {
  return await progressOperations.getUserProgress(userId);
});

// Get performance stats
const stats = monitor.getQueryStats('getStudentProgress');
console.log(`Average query time: ${stats?.average}ms`);
```

## 🎯 Best Practices

### 1. Use Compound Queries Efficiently

```typescript
// ✅ Good: Uses composite index
const query = query(
  collection(db, 'examResults'),
  where('studentId', '==', userId),
  where('subject', '==', 'Mathematics'),
  orderBy('timestamp', 'desc'),
  limit(10)
);

// ❌ Avoid: Requires separate queries
const allResults = await getDocs(collection(db, 'examResults'));
const filtered = allResults.docs.filter(/* client-side filtering */);
```

### 2. Implement Caching for Static Data

```typescript
import { FirestoreCache } from '@/lib/firestore-performance';

// Cache subject list (rarely changes)
let subjects = FirestoreCache.get('subjects');
if (!subjects) {
  subjects = await getSubjects();
  FirestoreCache.set('subjects', subjects, 60); // Cache for 60 minutes
}
```

### 3. Use Batch Operations

```typescript
import { batchOperations } from '@/lib/firestore-operations';

// Update multiple students efficiently
await batchOperations.batchUpdate([
  { collection: 'students', docId: 'student1', data: { status: 'active' } },
  { collection: 'students', docId: 'student2', data: { status: 'active' } }
]);
```

## 🔒 Security Rules

The optimized security rules provide:

- **Role-based access control** (student, teacher, admin)
- **Resource-level permissions** (users can only access their own data)
- **Operation-specific rules** (read vs. write permissions)

### Custom Claims Setup

Set user roles in Firebase Admin:

```javascript
// Set teacher role
await admin.auth().setCustomUserClaims(uid, { role: 'teacher' });

// Set admin role
await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

## 📈 Monitoring & Analytics

### Performance Monitoring

Monitor your Firestore performance:

```bash
# Run performance analysis
npm run db:analyze

# Start continuous monitoring
npm run db:monitor
```

### Key Metrics to Watch

- **Query latency**: Keep under 200ms for user-facing queries
- **Read operations**: Monitor for unexpected spikes
- **Index usage**: Ensure queries use proper indexes
- **Error rates**: Track failed operations

## 🔄 Data Migration

If migrating from another database:

1. **Plan your migration:**
   ```bash
   # Export existing data
   # Transform to Firestore format
   # Use batch imports
   ```

2. **Use the seeding script:**
   ```bash
   node scripts/seed-data.js
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Slow Queries**
   - Check if proper indexes exist
   - Review query patterns
   - Consider data structure changes

2. **Security Rule Errors**
   - Verify user authentication
   - Check custom claims
   - Review rule logic

3. **High Read Costs**
   - Implement caching
   - Optimize query patterns
   - Use pagination

### Debug Tools

```typescript
// Enable Firestore debug mode
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Check network status
await disableNetwork(db);
await enableNetwork(db);
```

## 📚 Additional Resources

- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Security Rules Guide](https://firebase.google.com/docs/rules/rules-language)
- [Performance Monitoring](https://firebase.google.com/docs/perf-mon)

## 🎯 Performance Targets

Your optimized setup targets:

- **Dashboard load**: < 500ms total
- **Real-time updates**: < 100ms latency
- **Search queries**: < 200ms response
- **Batch operations**: < 1s for 100 items
- **99.9% uptime** with Firebase's infrastructure

## 🔧 Customization

To adapt for your specific needs:

1. **Modify indexes** in `firestore.indexes.json`
2. **Update security rules** in `firestore.rules`
3. **Adjust cache TTL** in performance monitoring
4. **Customize query builders** for your data patterns

Your EDTECH_AI platform is now optimized for high-performance educational data management! 🎓

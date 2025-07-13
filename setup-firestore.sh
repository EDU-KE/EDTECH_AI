#!/bin/bash

# Firestore Optimization Setup Script
# This script sets up the optimized Firestore configuration for EDTECH_AI

echo "🔥 Setting up Firestore optimization for EDTECH_AI..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase first:"
    echo "firebase login"
    exit 1
fi

# Deploy Firestore indexes
echo "📊 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

# Deploy Firestore rules
echo "🔒 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

# Set up environment variables (if .env doesn't exist)
if [ ! -f .env ]; then
    echo "🌍 Creating .env file template..."
    cat > .env << EOL
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Development settings
NODE_ENV=development
EOL
    echo "📝 Please update the .env file with your Firebase configuration"
fi

# Install performance monitoring dependencies
echo "📦 Installing performance monitoring dependencies..."
npm install --save-dev @firebase/performance

# Create performance monitoring script
echo "📈 Creating performance monitoring script..."
cat > scripts/monitor-performance.js << 'EOL'
const { FirestorePerformanceMonitor, PerformanceOptimizer } = require('../src/lib/firestore-performance');

async function monitorPerformance() {
    console.log('🔍 Analyzing Firestore performance...');
    
    const analysis = PerformanceOptimizer.analyzeQueryPatterns();
    
    console.log('\n📊 Performance Analysis Results:');
    console.log('================================');
    
    if (analysis.slowQueries.length > 0) {
        console.log('\n⚠️  Slow Queries Detected:');
        analysis.slowQueries.forEach(query => {
            console.log(`  - ${query.name}: ${query.avgTime.toFixed(2)}ms average`);
        });
    } else {
        console.log('\n✅ No slow queries detected');
    }
    
    if (analysis.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        analysis.recommendations.forEach(rec => {
            console.log(`  - ${rec}`);
        });
    }
    
    const monitor = FirestorePerformanceMonitor.getInstance();
    const allStats = monitor.getAllStats();
    
    console.log('\n📈 Query Statistics:');
    Object.entries(allStats).forEach(([name, stats]) => {
        if (stats) {
            console.log(`  ${name}:`);
            console.log(`    Average: ${stats.average.toFixed(2)}ms`);
            console.log(`    Min: ${stats.min.toFixed(2)}ms`);
            console.log(`    Max: ${stats.max.toFixed(2)}ms`);
            console.log(`    Count: ${stats.count}`);
        }
    });
}

// Run monitoring every 5 minutes in development
if (process.env.NODE_ENV === 'development') {
    setInterval(monitorPerformance, 5 * 60 * 1000);
}

module.exports = { monitorPerformance };
EOL

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Make the performance monitoring script executable
chmod +x scripts/monitor-performance.js

# Update package.json scripts
echo "📝 Adding performance monitoring scripts to package.json..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = pkg.scripts || {};
pkg.scripts['db:deploy'] = 'firebase deploy --only firestore';
pkg.scripts['db:monitor'] = 'node scripts/monitor-performance.js';
pkg.scripts['db:analyze'] = 'node -e \"require(\\\"./scripts/monitor-performance\\\").monitorPerformance()\"';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Create a sample data seeding script
echo "🌱 Creating data seeding script..."
cat > scripts/seed-data.js << 'EOL'
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Initialize Firebase (you'll need to add your config)
const firebaseConfig = {
    // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data for testing
const sampleStudents = [
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        gradeLevel: 'Grade 10',
        status: 'active',
        enrollmentDate: serverTimestamp(),
        lastActive: serverTimestamp()
    },
    {
        name: 'Bob Smith',
        email: 'bob@example.com',
        gradeLevel: 'Grade 11',
        status: 'active',
        enrollmentDate: serverTimestamp(),
        lastActive: serverTimestamp()
    }
];

const sampleSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];

async function seedData() {
    console.log('🌱 Seeding sample data...');
    
    try {
        // Add sample students
        for (const student of sampleStudents) {
            const docRef = await addDoc(collection(db, 'students'), student);
            console.log(`✅ Added student: ${student.name} (${docRef.id})`);
            
            // Add sample learning progress for each student
            for (const subject of sampleSubjects) {
                await addDoc(collection(db, 'learningProgress'), {
                    userId: docRef.id,
                    subject: subject,
                    completionPercentage: Math.floor(Math.random() * 100),
                    completedModules: [`module1`, `module2`],
                    currentModule: `module${Math.floor(Math.random() * 5) + 1}`,
                    timeSpent: Math.floor(Math.random() * 3600), // seconds
                    lastUpdated: serverTimestamp()
                });
            }
            
            // Add sample exam results
            for (let i = 0; i < 5; i++) {
                await addDoc(collection(db, 'examResults'), {
                    studentId: docRef.id,
                    subject: sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)],
                    gradeLevel: student.gradeLevel,
                    score: Math.floor(Math.random() * 100),
                    examTitle: `Test ${i + 1}`,
                    totalQuestions: 20,
                    correctAnswers: Math.floor(Math.random() * 20),
                    timestamp: serverTimestamp()
                });
            }
        }
        
        console.log('✅ Sample data seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

if (require.main === module) {
    seedData();
}

module.exports = { seedData };
EOL

echo ""
echo "🎉 Firestore optimization setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with Firebase configuration"
echo "2. Run 'npm run db:deploy' to deploy indexes and rules"
echo "3. Run 'npm run db:monitor' to start performance monitoring"
echo "4. Optionally run 'node scripts/seed-data.js' to add sample data"
echo ""
echo "Your Firestore is now optimized for:"
echo "✅ Fast student queries with proper indexing"
echo "✅ Efficient exam result retrieval"
echo "✅ Real-time tutoring session support"
echo "✅ Optimized learning progress tracking"
echo "✅ Performance monitoring and analytics"
echo ""

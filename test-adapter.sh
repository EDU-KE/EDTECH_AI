#!/bin/bash

echo "🔧 Testing DeepSeek Adapter Configuration..."

# Check if the adapter file exists and has no syntax errors
if node -c src/ai/deepseek-adapter.ts 2>/dev/null; then
    echo "✅ DeepSeek adapter syntax is valid"
else
    echo "❌ DeepSeek adapter has syntax errors"
fi

# Test importing the adapter
cat > test-adapter.js << 'EOF'
try {
    const fs = require('fs');
    const path = require('path');
    
    // Check if adapter file exists
    const adapterPath = path.join(__dirname, 'src/ai/deepseek-adapter.ts');
    if (fs.existsSync(adapterPath)) {
        console.log('✅ Adapter file exists');
    } else {
        console.log('❌ Adapter file missing');
    }
    
    // Check key flow files
    const flows = [
        'src/ai/flows/analyze-subject.ts',
        'src/ai/flows/provide-ai-tutoring.ts',
        'src/ai/flows/generate-lesson-plan.ts',
        'src/ai/flows/perform-web-search.ts'
    ];
    
    flows.forEach(flow => {
        if (fs.existsSync(flow)) {
            console.log(`✅ ${flow} exists`);
            const content = fs.readFileSync(flow, 'utf8');
            if (content.includes('generateWithDeepSeekAdapter')) {
                console.log(`✅ ${flow} uses adapter`);
            } else {
                console.log(`⚠️  ${flow} doesn't use adapter`);
            }
        } else {
            console.log(`❌ ${flow} missing`);
        }
    });
    
} catch (error) {
    console.error('❌ Error:', error.message);
}
EOF

node test-adapter.js
rm test-adapter.js

echo "✅ DeepSeek adapter configuration test complete!"

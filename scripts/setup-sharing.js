#!/usr/bin/env node

/**
 * Setup script for shareable canvas functionality
 * Run this script to verify your setup is complete
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up shareable canvas functionality...\n');

// Check if all required files exist
const requiredFiles = [
  'app/api/share/route.ts',
  'app/api/share/[token]/route.ts',
  'app/dashboard/project/[projectId]/_shared/share-dialog.tsx',
  'app/share/[token]/page.tsx',
  'app/share/[token]/shared-canvas.tsx',
  'app/share/layout.tsx',
  'app/share/not-found.tsx',
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please apply all the code changes first.');
  process.exit(1);
}

// Check environment variables
console.log('\n🔐 Checking environment variables...');
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('NEXT_PUBLIC_APP_URL')) {
    console.log('  ✅ NEXT_PUBLIC_APP_URL is set');
  } else {
    console.log('  ⚠️  NEXT_PUBLIC_APP_URL not found in .env');
    console.log('     Add: NEXT_PUBLIC_APP_URL="http://localhost:3000"');
  }
} else {
  console.log('  ⚠️  .env file not found');
}

// Check database schema
console.log('\n🗄️  Checking database schema...');
const schemaPath = path.join(process.cwd(), 'db/schema.tsx');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  if (schemaContent.includes('ShareLink')) {
    console.log('  ✅ ShareLink table is defined in schema');
  } else {
    console.log('  ❌ ShareLink table not found in schema');
  }
} else {
  console.log('  ❌ Database schema file not found');
}

console.log('\n🎉 Setup verification complete!');
console.log('\nNext steps:');
console.log('1. Run your database migration command');
console.log('2. Start your development server');
console.log('3. Test the sharing functionality');
console.log('\nTo test:');
console.log('- Create a new project or open existing one');
console.log('- Click the "Share" button in the sidebar');
console.log('- Generate a share link');
console.log('- Open the link in a new browser window');

console.log('\n📚 For more details, see MIGRATION.md');
// Quick test to check if .env is loaded correctly
require('dotenv').config();

console.log('=== Environment Variables Test ===\n');

console.log('GEMINI_API_KEY:');
console.log('  Exists:', !!process.env.GEMINI_API_KEY);
console.log('  Length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
console.log('  First 10 chars:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'N/A');
console.log('  Has whitespace:', process.env.GEMINI_API_KEY ? /\s/.test(process.env.GEMINI_API_KEY) : 'N/A');

console.log('\nCLOUDINARY_CLOUD_NAME:');
console.log('  Exists:', !!process.env.CLOUDINARY_CLOUD_NAME);
console.log('  Value:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');

console.log('\nCLOUDINARY_API_KEY:');
console.log('  Exists:', !!process.env.CLOUDINARY_API_KEY);

console.log('\nCLOUDINARY_API_SECRET:');
console.log('  Exists:', !!process.env.CLOUDINARY_API_SECRET);

console.log('\n=== All Environment Variables ===');
const envVars = Object.keys(process.env).filter(key =>
    key.includes('GEMINI') || key.includes('CLOUDINARY') || key === 'PORT'
);
console.log('Relevant vars:', envVars);

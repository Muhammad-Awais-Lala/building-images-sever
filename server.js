require('dotenv').config();
const express = require('express');
const cors = require('cors');
const generateImagesRouter = require('./routes/generateImages');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/generate-images', generateImagesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🏗️  Generate images: http://localhost:${PORT}/generate-images`);

    // Debug: Check if environment variables are loaded
    console.log(`\n🔑 Environment Check:`);
    console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Loaded (length: ' + process.env.GEMINI_API_KEY.length + ')' : '❌ NOT FOUND'}`);
    console.log(`   CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Loaded' : '❌ NOT FOUND'}`);
});

module.exports = app;

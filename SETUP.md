# Quick Setup Guide

## 🚀 Getting Started

### 1. Configure Environment Variables

Edit the `.env.example` file and add your credentials, then save it as `.env`:

```env
PORT=3000

# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Get your Gemini API key:**
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy and paste it into your `.env` file

**Note:** The `.env` file is already in `.gitignore` to protect your credentials.


### 2. Start the Server

**Development mode (recommended):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 3. Test the API

**Option 1: Using the test script**
```bash
node test.js
```

**Option 2: Using curl**
```bash
curl -X POST http://localhost:3000/generate-images \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

**Option 3: Import Postman Collection**
- Import `postman_collection.json` into Postman
- Run any of the pre-configured requests

**Option 4: Health Check**
```bash
curl http://localhost:3000/health
```

## 📋 API Endpoints

### POST /generate-images
Generates building elevation and floor plan images.

**Required Fields:**
- `plot_depth_ft` (number)
- `plot_width_ft` (number)
- `number_of_floors` (number: 1-3)
- `floors_configuration` (array)

**Optional Fields:**
- `kitchen_type` (string)
- `architectural_style` (string)
- `extra_features` (string)

### GET /health
Health check endpoint to verify server is running.

## 🔧 Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify all dependencies are installed: `npm install`
- Check `.env` file exists and has valid credentials

### Image generation fails
- Verify your **Gemini API key** is correct
- Check that you have access to the Gemini 2.5 Flash Image model
- Ensure you have sufficient API quota/credits

### Cloudinary upload fails
- Verify all three Cloudinary credentials are correct
- Check your Cloudinary account is active
- Ensure you have storage space available

## 📝 Notes

- Image generation typically takes 30-120 seconds
- All images are generated in parallel for better performance
- Images are stored in the `construction-planner` folder in Cloudinary
- The server has a 2-minute timeout for AI generation requests

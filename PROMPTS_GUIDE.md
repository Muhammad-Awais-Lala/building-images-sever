# 📝 How Prompts Work in This Project

## Overview

This project uses **Google Gemini 2.5 Flash Image** model to generate architectural images based on detailed text prompts. The prompt system is designed to create two types of images:

1. **Building Elevation** - Front view of the entire building
2. **Floor Blueprints** - Top-down architectural plans for each floor

---

## 🔄 Prompt Flow

### Step-by-Step Process

```
User Request (JSON)
    ↓
Controller receives building specifications
    ↓
promptBuilder.js creates detailed prompts
    ↓
One prompt for elevation + One prompt per floor
    ↓
Each prompt sent to Gemini 2.5 Flash Image
    ↓
Images generated and uploaded to Cloudinary
    ↓
URLs returned to user
```

---

## 📂 File Structure

### 1. **promptBuilder.js** (`utils/promptBuilder.js`)
This is the core file that constructs the AI prompts.

**Main Function: `buildPrompts(buildingSpec)`**

**Input:**
```javascript
{
  plot_depth_ft: 43.6,
  plot_width_ft: 25,
  number_of_floors: 2,
  kitchen_type: "open",
  architectural_style: "Traditional",
  extra_features: "Balcony, Solar panels",
  floors_configuration: [
    {
      floorNumber: 1,
      floorName: "Ground Floor",
      bedrooms: 2,
      bathrooms: 2,
      livingRooms: "1",
      kitchens: "1",
      drawingDining: "Required",
      garage: "Required"
    },
    {
      floorNumber: 2,
      floorName: "1st Floor",
      bedrooms: 3,
      bathrooms: 1,
      livingRooms: "1",
      kitchens: "1",
      drawingDining: "Required"
    }
  ]
}
```

**Output:**
```javascript
[
  {
    type: 'elevation',
    prompt: 'Generate a professional architectural front elevation...'
  },
  {
    type: 'floor_1_blueprint',
    prompt: 'Generate a detailed architectural floor plan blueprint...'
  },
  {
    type: 'floor_2_blueprint',
    prompt: 'Generate a detailed architectural floor plan blueprint...'
  }
]
```

---

## 🏗️ Prompt Types

### Type 1: Elevation Prompt

**Purpose:** Generate a front view of the entire building

**Function:** `buildElevationPrompt()`

**Example Prompt:**
```
Generate a professional architectural front elevation image of a Traditional style building. 
The building has 2 floors. 
Plot dimensions: 25 ft width × 43.6 ft depth. 
Features open kitchen layout. 
Additional features: Balcony, Solar panels. 
The image should show a realistic, detailed front view of the building exterior with proper proportions, 
windows, doors, and architectural details consistent with Traditional style. 
High quality, professional architectural rendering.
```

**What it includes:**
- ✅ Architectural style (Traditional, Modern, Contemporary, etc.)
- ✅ Number of floors
- ✅ Plot dimensions (width × depth)
- ✅ Kitchen type (open/closed)
- ✅ Extra features (balcony, solar panels, etc.)
- ✅ Quality requirements (realistic, detailed, professional)

---

### Type 2: Blueprint Prompt

**Purpose:** Generate a floor plan for a specific floor

**Function:** `buildBlueprintPrompt()`

**Example Prompt for Ground Floor:**
```
Generate a detailed architectural floor plan blueprint for Ground Floor. 
Plot dimensions: 25 ft × 43.6 ft. 
Traditional architectural style. 
Layout includes: 2 bedrooms, 2 bathrooms, 1 living room, 1 kitchen, drawing/dining area, garage. 
Kitchen type: open. 
The blueprint should be a professional architectural floor plan with clear room labels, 
dimensions, door and window placements, and proper architectural symbols. 
Top-down view, black and white or blue blueprint style, technical drawing quality.
```

**What it includes:**
- ✅ Floor name (Ground Floor, 1st Floor, etc.)
- ✅ Plot dimensions
- ✅ Architectural style
- ✅ Room count (bedrooms, bathrooms, living rooms, kitchens)
- ✅ Special areas (drawing/dining, garage)
- ✅ Kitchen type
- ✅ Blueprint style requirements (top-down, technical drawing)

---

## 🤖 How Gemini 2.5 Flash Image Processes Prompts

### Service File: `bnanaService.js`

**Key Steps:**

1. **Initialize Gemini API**
   ```javascript
   const genAI = new GoogleGenerativeAI(apiKey);
   const model = genAI.getGenerativeModel({ 
     model: 'gemini-2.5-flash-image'
   });
   ```

2. **Send Prompt to Model**
   ```javascript
   const result = await model.generateContent({
     contents: [{
       role: 'user',
       parts: [{
         text: prompt  // Your detailed prompt goes here
       }]
     }],
     generationConfig: {
       temperature: 0.7,      // Creativity level (0-1)
       topK: 40,              // Diversity of output
       topP: 0.95,            // Nucleus sampling
       maxOutputTokens: 8192  // Max response length
     }
   });
   ```

3. **Extract Image Data**
   - Gemini returns image as base64-encoded data
   - Extract from `response.candidates[0].content.parts`
   - Convert base64 to Buffer
   - Return Buffer for Cloudinary upload

---

## 🎨 Prompt Engineering Tips

### For Better Elevation Images:
- ✅ Be specific about architectural style
- ✅ Mention number of floors clearly
- ✅ Include special features (balconies, terraces, etc.)
- ✅ Specify desired quality (professional, realistic, detailed)

### For Better Blueprint Images:
- ✅ Specify exact room counts
- ✅ Mention plot dimensions
- ✅ Request specific blueprint style (black/white, blue print)
- ✅ Ask for labels and dimensions
- ✅ Request architectural symbols

---

## 🔧 Customizing Prompts

### To modify prompts, edit `utils/promptBuilder.js`:

**Example: Add more detail to elevation prompts**
```javascript
// In buildElevationPrompt function
prompt += `Include large windows on the front facade. `;
prompt += `Add a modern entrance with glass door. `;
```

**Example: Customize blueprint style**
```javascript
// In buildBlueprintPrompt function
prompt += `Use blue blueprint style with white lines. `;
prompt += `Include furniture layout suggestions. `;
```

---

## 📊 Prompt Parameters

### Generation Config (in bnanaService.js)

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `temperature` | 0.7 | Controls randomness (0=deterministic, 1=creative) |
| `topK` | 40 | Limits vocabulary to top K tokens |
| `topP` | 0.95 | Nucleus sampling threshold |
| `maxOutputTokens` | 8192 | Maximum response length |

**Adjust these for different results:**
- **More consistent images**: Lower temperature (0.4-0.6)
- **More creative images**: Higher temperature (0.8-1.0)
- **More variety**: Increase topK and topP

---

## 🚀 Complete Flow Example

### User sends request:
```json
{
  "plot_depth_ft": 43.6,
  "plot_width_ft": 25,
  "number_of_floors": 2,
  "architectural_style": "Traditional",
  "floors_configuration": [...]
}
```

### System generates 3 prompts:
1. **Elevation prompt** → Sent to Gemini → Returns elevation image
2. **Floor 1 blueprint prompt** → Sent to Gemini → Returns floor 1 blueprint
3. **Floor 2 blueprint prompt** → Sent to Gemini → Returns floor 2 blueprint

### All images uploaded to Cloudinary:
```json
{
  "elevation_url": "https://res.cloudinary.com/.../elevation.png",
  "floor_1_blueprint_url": "https://res.cloudinary.com/.../floor1.png",
  "floor_2_blueprint_url": "https://res.cloudinary.com/.../floor2.png"
}
```

---

## 🔑 Environment Variables

Make sure to set in your `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get your Gemini API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into `.env` file

---

## 📝 Summary

**Prompt Flow:**
1. User data → `promptBuilder.js` → Detailed text prompts
2. Prompts → `bnanaService.js` → Gemini 2.5 Flash Image API
3. Gemini → Base64 image data → Buffer
4. Buffer → `cloudinaryService.js` → Cloudinary URLs
5. URLs → Response to user

**Key Files:**
- `utils/promptBuilder.js` - Creates prompts
- `services/bnanaService.js` - Calls Gemini API
- `controllers/imageController.js` - Orchestrates the flow

**Customization:**
- Edit prompt templates in `promptBuilder.js`
- Adjust generation config in `bnanaService.js`
- Modify response format in `imageController.js`

# Construction Planner - Images Server

A Node.js server that generates building elevation and floor plan images using **Google Gemini 2.5 Flash Image** model and uploads them to Cloudinary.


## Features

- ✅ Generate building front elevation images
- ✅ Generate floor plan blueprints for each floor
- ✅ Dynamic floor support (1-3 floors)
- ✅ Upload generated images to Cloudinary
- ✅ RESTful API endpoint
- ✅ Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- **Google Gemini API key** ([Get it here](https://makersuite.google.com/app/apikey))
- Cloudinary account credentials


## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your credentials:
   ```env
   PORT=3000
   
   # Google Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```


## Usage

### Start the server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### API Endpoint

#### POST `/generate-images`

Generates building images based on the provided specifications.

**Request Body:**
```json
{
  "plot_depth_ft": 43.6,
  "plot_width_ft": 25,
  "number_of_floors": 2,
  "kitchen_type": "open",
  "architectural_style": "Traditional",
  "extra_features": "",
  "floors_configuration": [
    {
      "floorNumber": 1,
      "floorName": "Ground Floor",
      "bedrooms": 2,
      "bathrooms": 2,
      "livingRooms": "1",
      "kitchens": "1",
      "drawingDining": "Required",
      "garage": "Required"
    },
    {
      "floorNumber": 2,
      "floorName": "1st Floor",
      "bedrooms": "3",
      "bathrooms": "1",
      "livingRooms": "1",
      "kitchens": "1",
      "drawingDining": "Required"
    }
  ]
}
```

**Response (2 floors example):**
```json
{
  "floor_1_blueprint_url": "https://res.cloudinary.com/.../floor1.png",
  "floor_2_blueprint_url": "https://res.cloudinary.com/.../floor2.png",
  "elevation_url": "https://res.cloudinary.com/.../elevation.png"
}
```

**Response (1 floor example):**
```json
{
  "floor_1_blueprint_url": "https://res.cloudinary.com/.../floor1.png",
  "elevation_url": "https://res.cloudinary.com/.../elevation.png"
}
```

**Response (3 floors example):**
```json
{
  "floor_1_blueprint_url": "https://res.cloudinary.com/.../floor1.png",
  "floor_2_blueprint_url": "https://res.cloudinary.com/.../floor2.png",
  "floor_3_blueprint_url": "https://res.cloudinary.com/.../floor3.png",
  "elevation_url": "https://res.cloudinary.com/.../elevation.png"
}
```

### Health Check

#### GET `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Project Structure

```
ImagesServer/
├── controllers/
│   └── imageController.js      # Main controller logic
├── routes/
│   └── generateImages.js       # Route definitions
├── services/
│   ├── bnanaService.js         # Gemini 2.5 Flash Image integration
│   └── cloudinaryService.js    # Cloudinary upload service
├── utils/
│   └── promptBuilder.js        # AI prompt generation
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
├── README.md                   # This file
└── server.js                   # Express server setup
```

## How It Works

1. **Receive Request**: The API receives building specifications including plot size, floors, and room configurations.

2. **Build Prompts**: The system generates detailed AI prompts:
   - One prompt for the building's front elevation
   - One prompt for each floor's blueprint

3. **Generate Images**: Each prompt is sent to the **Gemini 2.5 Flash Image** model to generate images.

4. **Upload to Cloudinary**: All generated images are uploaded to Cloudinary for permanent storage.

5. **Return URLs**: The API responds with Cloudinary URLs for all generated images.

## Error Handling

The server includes comprehensive error handling:
- Validation of required fields
- API timeout handling (2 minutes)
- Cloudinary upload error handling
- Detailed error messages in development mode

## Notes

- Image generation may take 30-120 seconds depending on the number of floors
- All images are generated in parallel for better performance
- Images are stored in the `construction-planner` folder in Cloudinary
- Uses **Google Gemini 2.5 Flash Image** model for high-quality architectural image generation
- See `PROMPTS_GUIDE.md` for detailed information on how prompts work

## License

ISC

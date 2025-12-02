// Test script for the /generate-images endpoint
// Run with: node test.js

const axios = require('axios');

const testData = {
    plot_depth_ft: 43.6,
    plot_width_ft: 25,
    number_of_floors: 2,
    kitchen_type: "open",
    architectural_style: "Traditional",
    extra_features: "",
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
            bedrooms: "3",
            bathrooms: "1",
            livingRooms: "1",
            kitchens: "1",
            drawingDining: "Required"
        }
    ]
};

async function testGenerateImages() {
    try {
        console.log('🧪 Testing /generate-images endpoint...\n');
        console.log('📤 Sending request with test data...');

        const startTime = Date.now();

        const response = await axios.post('http://localhost:3000/generate-images', testData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 180000 // 3 minutes timeout
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`\n✅ Success! (took ${duration}s)\n`);
        console.log('📸 Generated Images:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ Error:', error.response?.data || error.message);

        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Make sure the server is running: npm start');
        }
    }
}

// Run the test
testGenerateImages();

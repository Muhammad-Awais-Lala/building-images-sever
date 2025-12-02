const { generateImageWithBnana } = require('../services/bnanaService');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { buildPrompts } = require('../utils/promptBuilder');

/**
 * Generate building images (elevation + floor blueprints)
 * @route POST /generate-images
 */
const generateBuildingImages = async (req, res, next) => {
    try {
        const {
            plot_depth_ft,
            plot_width_ft,
            number_of_floors,
            kitchen_type,
            architectural_style,
            extra_features,
            floors_configuration
        } = req.body;

        // Validate required fields
        if (!plot_depth_ft || !plot_width_ft || !number_of_floors || !floors_configuration) {
            return res.status(400).json({
                error: true,
                message: 'Missing required fields: plot_depth_ft, plot_width_ft, number_of_floors, floors_configuration'
            });
        }

        // Validate floors_configuration is an array
        if (!Array.isArray(floors_configuration) || floors_configuration.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'floors_configuration must be a non-empty array'
            });
        }

        // Validate number of floors matches configuration
        if (floors_configuration.length !== number_of_floors) {
            return res.status(400).json({
                error: true,
                message: `Number of floors (${number_of_floors}) does not match floors_configuration length (${floors_configuration.length})`
            });
        }

        console.log(`📋 Generating images for ${number_of_floors}-floor building...`);

        // Build prompts for elevation and each floor blueprint
        const prompts = buildPrompts({
            plot_depth_ft,
            plot_width_ft,
            number_of_floors,
            kitchen_type,
            architectural_style,
            extra_features,
            floors_configuration
        });

        console.log(`🎨 Generated ${prompts.length} prompts (1 elevation + ${floors_configuration.length} blueprints)`);

        // Generate all images in parallel
        const imageGenerationPromises = prompts.map(async (promptData) => {
            try {
                console.log(`🖼️  Generating ${promptData.type}...`);
                const imageBuffer = await generateImageWithBnana(promptData.prompt);

                console.log(`☁️  Uploading ${promptData.type} to Cloudinary...`);
                const cloudinaryUrl = await uploadToCloudinary(imageBuffer, promptData.type);

                return {
                    type: promptData.type,
                    url: cloudinaryUrl
                };
            } catch (error) {
                console.error(`❌ Error generating ${promptData.type}:`, error.message);
                throw new Error(`Failed to generate ${promptData.type}: ${error.message}`);
            }
        });

        // Wait for all images to be generated and uploaded
        const results = await Promise.all(imageGenerationPromises);

        // Build response object
        const response = {};
        results.forEach(result => {
            if (result.type === 'elevation') {
                response.elevation_url = result.url;
            } else {
                // Extract floor number from type (e.g., "floor_1_blueprint" -> "floor_1_blueprint_url")
                response[`${result.type}_url`] = result.url;
            }
        });

        console.log('✅ All images generated successfully!');

        res.json(response);

    } catch (error) {
        console.error('❌ Error in generateBuildingImages:', error);
        next(error);
    }
};

module.exports = {
    generateBuildingImages
};

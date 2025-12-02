const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} imageBuffer - The image data as a buffer
 * @param {string} imageName - Name/identifier for the image
 * @returns {Promise<string>} - Cloudinary URL of uploaded image
 */
const uploadToCloudinary = async (imageBuffer, imageName) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary credentials are not configured in environment variables');
        }

        // Convert buffer to base64 data URI
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                base64Image,
                {
                    folder: 'construction-planner',
                    public_id: `${imageName}_${Date.now()}`,
                    resource_type: 'image',
                    format: 'png'
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
        return result.secure_url;

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
    }
};

module.exports = {
    uploadToCloudinary
};

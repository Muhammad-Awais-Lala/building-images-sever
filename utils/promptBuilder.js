/**
 * Build prompts for elevation and floor blueprints
 * @param {Object} buildingSpec - Complete building specification
 * @returns {Array} - Array of prompt objects with type and prompt text
 */
const buildPrompts = (buildingSpec) => {
    const {
        plot_depth_ft,
        plot_width_ft,
        number_of_floors,
        kitchen_type,
        architectural_style,
        extra_features,
        floors_configuration
    } = buildingSpec;

    const prompts = [];

    // Build elevation prompt (one for entire building)
    const elevationPrompt = buildElevationPrompt({
        plot_depth_ft,
        plot_width_ft,
        number_of_floors,
        architectural_style,
        kitchen_type,
        extra_features
    });

    prompts.push({
        type: 'elevation',
        prompt: elevationPrompt
    });

    // Build blueprint prompts (one per floor)
    floors_configuration.forEach((floor, index) => {
        const blueprintPrompt = buildBlueprintPrompt({
            floor,
            plot_depth_ft,
            plot_width_ft,
            kitchen_type,
            architectural_style
        });

        prompts.push({
            type: `floor_${floor.floorNumber}_blueprint`,
            prompt: blueprintPrompt
        });
    });

    return prompts;
};

/**
 * Build prompt for building elevation
 */
const buildElevationPrompt = ({
    plot_depth_ft,
    plot_width_ft,
    number_of_floors,
    architectural_style,
    kitchen_type,
    extra_features
}) => {
    let prompt = `Generate a professional architectural front elevation image of a ${architectural_style} style building. `;
    prompt += `The building has ${number_of_floors} floor${number_of_floors > 1 ? 's' : ''}. `;
    prompt += `Plot dimensions: ${plot_width_ft} ft width × ${plot_depth_ft} ft depth. `;

    if (kitchen_type) {
        prompt += `Features ${kitchen_type} kitchen layout. `;
    }

    if (extra_features && extra_features.trim()) {
        prompt += `Additional features: ${extra_features}. `;
    }

    prompt += `The image should show a realistic, detailed front view of the building exterior with proper proportions, `;
    prompt += `windows, doors, and architectural details consistent with ${architectural_style} style. `;
    prompt += `High quality, professional architectural rendering.`;

    return prompt;
};

/**
 * Build prompt for floor blueprint
 */
const buildBlueprintPrompt = ({
    floor,
    plot_depth_ft,
    plot_width_ft,
    kitchen_type,
    architectural_style
}) => {
    const {
        floorNumber,
        floorName,
        bedrooms,
        bathrooms,
        livingRooms,
        kitchens,
        drawingDining,
        garage
    } = floor;

    let prompt = `Generate a detailed architectural floor plan blueprint for ${floorName}. `;
    prompt += `Plot dimensions: ${plot_width_ft} ft × ${plot_depth_ft} ft. `;
    prompt += `${architectural_style} architectural style. `;

    // Add room specifications
    const rooms = [];
    if (bedrooms) rooms.push(`${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}`);
    if (bathrooms) rooms.push(`${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}`);
    if (livingRooms) rooms.push(`${livingRooms} living room${livingRooms > 1 ? 's' : ''}`);
    if (kitchens) rooms.push(`${kitchens} kitchen${kitchens > 1 ? 's' : ''}`);
    if (drawingDining && drawingDining.toLowerCase() === 'required') {
        rooms.push('drawing/dining area');
    }
    if (garage && garage.toLowerCase() === 'required') {
        rooms.push('garage');
    }

    if (rooms.length > 0) {
        prompt += `Layout includes: ${rooms.join(', ')}. `;
    }

    if (kitchen_type) {
        prompt += `Kitchen type: ${kitchen_type}. `;
    }

    prompt += `The blueprint should be a professional architectural floor plan with clear room labels, `;
    prompt += `dimensions, door and window placements, and proper architectural symbols. `;
    prompt += `Top-down view, black and white or blue blueprint style, technical drawing quality.`;

    return prompt;
};

module.exports = {
    buildPrompts
};

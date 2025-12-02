const express = require('express');
const router = express.Router();
const { generateBuildingImages } = require('../controllers/imageController');

// POST /generate-images
router.post('/', generateBuildingImages);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllCountries, getCountryByName } = require('../controllers/countries');
const { authenticateJwtToken, authenticateApiKey } = require('../middleware/auth');

// Public route
router.get('/', authenticateJwtToken, authenticateApiKey, getAllCountries);

// Authenticated route
router.get('/:name', authenticateJwtToken, authenticateApiKey, getCountryByName);

module.exports = router;
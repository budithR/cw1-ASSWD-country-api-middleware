const express = require('express');
const router = express.Router();
const { 
  generateKey, 
  getUserKeys, 
  revokeKey,
  getAllKeys 
} = require('../controllers/keys');
const {authenticateJwtToken, authenticateApiKey,} = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

// User routes
router.post('/generate', authenticateJwtToken, generateKey);
router.get('/', authenticateJwtToken, getUserKeys);
router.put('/revoke/:id', authenticateJwtToken, revokeKey);

// Admin routes
router.get('/all', authenticateJwtToken, authenticateApiKey, isAdmin, getAllKeys);

module.exports = router;
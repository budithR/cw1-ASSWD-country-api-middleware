const { v4: uuidv4 } = require('uuid');
const ApiKey = require('../models/ApiKey');
const User = require('../models/User');

const generateKey = async (req, res) => {
  try {
    const newKey = await ApiKey.create({
      key: `api_${uuidv4()}`,
      userId: req.user.id
    });
    
    res.status(201).json({ key: newKey.key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({ 
      where: { userId: req.user.id },
      attributes: ['id', 'key', 'isActive', 'lastUsed', 'usageCount', 'createdAt']
    });
    
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const revokeKey = async (req, res) => {
  try {
    const { id } = req.params;
    
    const key = await ApiKey.findOne({ 
      where: { id, userId: req.user.id } 
    });
    
    if (!key) {
      return res.status(404).json({ error: 'Key not found' });
    }
    
    key.isActive = false;
    await key.save();
    
    res.json({ message: 'Key revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin-only functions
const getAllKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username', 'email']
      }]
    });
    
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  generateKey, 
  getUserKeys, 
  revokeKey,
  getAllKeys 
};
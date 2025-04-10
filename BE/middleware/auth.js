const jwt = require('jsonwebtoken');
const ApiKey = require('../models/ApiKey');
const RequestLog = require('../models/RequestLog');

const authenticate = async (req, res, next) => {
  try {
    // Check for API key in header
    const apiKey = req.header('X-API-Key');
    
    if (apiKey) {
      const keyRecord = await ApiKey.findOne({ 
        where: { key: apiKey, isActive: true } 
      });
      
      if (!keyRecord) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      
      // Update key usage
      keyRecord.lastUsed = new Date();
      keyRecord.usageCount += 1;
      await keyRecord.save();
      
      // Log the request
      await RequestLog.create({
        apiKeyId: keyRecord.id,
        endpoint: req.originalUrl,
        ipAddress: req.ip,
        statusCode: 200
      });
      
      req.user = { id: keyRecord.userId };
      return next();
    }
    
    // Check for JWT token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication' });
  }
};


const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const keyRecord = await ApiKey.findOne({ 
      where: { key: apiKey, isActive: true } 
    });
    
    if (!keyRecord) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Update key usage
    keyRecord.lastUsed = new Date();
    keyRecord.usageCount += 1;
    await keyRecord.save();
    
    // Log the request
    await RequestLog.create({
      apiKeyId: keyRecord.id,
      endpoint: req.originalUrl,
      ipAddress: req.ip,
      statusCode: 200
    });
    
    req.user = { id: keyRecord.userId };
    next();
  } catch (error) {
    res.status(500).json({ error: 'API key validation failed' });
  }
};


const authenticateJwtToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'JWT token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid JWT token' });
  }
};


module.exports = {authenticate, authenticateApiKey, authenticateJwtToken};
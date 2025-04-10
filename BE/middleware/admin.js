const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = isAdmin;
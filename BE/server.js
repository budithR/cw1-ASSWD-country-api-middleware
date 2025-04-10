require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/countries');
const keyRoutes = require('./routes/key');

// Import models
const User = require('./models/User');
const ApiKey = require('./models/ApiKey');
const RequestLog = require('./models/RequestLog');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/keys', keyRoutes);

// Database relations
ApiKey.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ApiKey, { foreignKey: 'userId' });

RequestLog.belongsTo(ApiKey, { foreignKey: 'apiKeyId' });
ApiKey.hasMany(RequestLog, { foreignKey: 'apiKeyId' });

// Sync database and start server
// sequelize.sync({ alter: true }).then(() => {
//   app.listen(process.env.PORT || 3001, () => {
//     console.log(`Server running on port ${process.env.PORT || 3001}`);
//   });
// }).catch(error => {
//   console.error('Database sync error:', error);
// });

const syncDatabase = async () => {
  try {
    // Completely disable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    // Drop all tables (will recreate them)
    await sequelize.drop();
    
    // Create fresh tables
    await sequelize.sync();
    
    // Re-enable foreign keys
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database sync error:', error);
    // Try fallback method if the above fails
    await forceCreateFreshDatabase();
  }
};

const forceCreateFreshDatabase = async () => {
  try {
    // Nuclear option - delete and recreate the entire DB file
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, 'database.sqlite');
    
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    
    await sequelize.sync();
    console.log('Fresh database created after forced reset');
  } catch (error) {
    console.error('Fatal database error:', error);
    process.exit(1);
  }
};

// Start the server
syncDatabase().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  });
});
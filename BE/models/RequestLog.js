const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RequestLog = sequelize.define('RequestLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  apiKeyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ApiKeys',
      key: 'id'
    }
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING
  },
  statusCode: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true
});

module.exports = RequestLog;
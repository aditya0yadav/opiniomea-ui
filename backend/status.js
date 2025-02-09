const { DataTypes } = require('sequelize');
const Users = require('./User');
const sequelize = require('./config');  

const SurveyStatus = sequelize.define('SurveyStatus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    
  },
  panelistID : {
    type: DataTypes.STRING,
  },
  points: {
    type: DataTypes.INTEGER,
    
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    
    validate: {
      isIn: [['terminate', 'complete', 'quotafull', "quality"]], // Allowed statuses
    },
  },
}, {
  tableName: 'survey_status',
  timestamps: true, 
});

module.exports = SurveyStatus;

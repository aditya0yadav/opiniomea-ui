const { DataTypes } = require('sequelize');
const sequelize = require('./config'); // Import the correct sequelize instance

const UserProfile = sequelize.define('UserProfile', {
    id  : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true

    },
    point : {
        type : DataTypes.INTEGER
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
        },
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'user_profiles',
    timestamps: true,
});

module.exports = UserProfile; // Export the model

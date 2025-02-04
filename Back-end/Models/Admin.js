const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/db.js'); // Replace with your Sequelize instance

const Admin = sequelize.define('Admin', {
    id_admin: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    prenom: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    nom: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Assuming email should be unique
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    tableName: 'ADMIN', // Table name in your database
    timestamps: false, // Disable timestamps if you don't have `createdAt` and `updatedAt` fields
});

module.exports = { Admin };

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../Config/db.js');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    puv: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    stock: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NbCommande: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    art_localcode: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    art_globalcode: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'articles',
    timestamps: true
});

module.exports = { Article };

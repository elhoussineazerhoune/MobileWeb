// Import des modèles
const { Article } = require('./Article.js');
const { Admin } = require('./Admin.js');
const { Client } = require('./Client.js');
const { Pack } = require('./Pack.js');
const { Commande } = require('./Commande.js');
const { CommandeDetail } = require('./CommadeDetails.js');
const { CommandePack } = require('./CommandePack.js');
const { SystemeInfos } = require('./SystemeInfos.js');
const { Categorie } = require('./Categorie');

// Relations entre Commande et Client
Client.hasMany(Commande, {
    foreignKey: 'clientId',
    as: 'commandes',
});
Commande.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client',
});

// Relations entre Commande et CommandeDetail
Commande.hasMany(CommandeDetail, {
    foreignKey: 'commandeId',
    as: 'details',
});
CommandeDetail.belongsTo(Commande, {
    foreignKey: 'commandeId',
    as: 'commande',
});

// Relations entre Article et CommandeDetail
Article.hasMany(CommandeDetail, {
    foreignKey: 'articleId',
    as: 'details',
});
CommandeDetail.belongsTo(Article, {
    foreignKey: 'articleId',
    as: 'article',
});

// Relations entre CommandePack, Pack et Client
CommandePack.belongsTo(Pack, {
    foreignKey: 'packId',
    as: 'packDemmande',
});
// Pack.hasMany(Article, {
//     foreignKey: "packId",
//     as: "produitsListe",
//   });
Pack.hasMany(CommandePack, {
    foreignKey: 'packId',
    as: 'commandesPack',
});

CommandePack.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'clientDemmande',
});
Client.hasMany(CommandePack, {
    foreignKey: 'clientId',
    as: 'commandesPack',
});

// Define associations
Article.belongsTo(Categorie, {
    foreignKey: 'categorie_id',
    as: 'categorie'  // Changed to lowercase to match usage
});

Categorie.hasMany(Article, {
    foreignKey: 'categorie_id',
    as: 'articles'
});

module.exports = {
    Article,
    Categorie
};

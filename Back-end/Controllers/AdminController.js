const { Admin } = require('../Models/Admin.js');
const { Commande } = require('../Models/Commande');
const { Client } = require('../Models/Client.js');
const { Article } = require('../Models/Article.js');
const { fn, col, where, literal, Op } = require('sequelize');
const bcrypt = require("bcryptjs");
const moment = require('moment');
require('moment/locale/fr');
const jwt = require("jsonwebtoken");


const createToken = (id) => {
    return jwt.sign(id, process.env.JWT_SECRET);
}

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne();
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve admin', error });
    }
}

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await Admin.findOne({ where: { email: email } });
        if (!client) {
            return res.json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await Admin.findOne({ where: { password: password } });
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }
        const token = createToken(client.id_admin);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Something went wrong" });
    }
}

const getWeekInformations = async (req, res) => {
    try {
        /**
         * je vais definir un champs pour definir la date d'une semaine avant
         */
        const startOfThisWeek = moment().startOf('week').toDate();
        const endOfThisWeek = moment().endOf('week').toDate();

        // Début de la journée
        const startOfToday = moment().startOf('day').toDate(); // 00:00:00 aujourd'hui
        // Fin de la journée
        const endOfToday = moment().endOf('day').toDate();
        /**
         * je cherche ensuite toutes les commandes livrées
         */
        const livredCommandsThisWeek = await Commande.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfThisWeek, endOfThisWeek],
                },
                status: "validé",
            },
        });
        /**
         * je compte le revenue d'après ces commandes
         */
        let moneyThisWeek = 0;
        livredCommandsThisWeek.map((command) => {
            moneyThisWeek += command.prixTotal;
        })

        /**
         * je compte le nombre de commandes en general pour la semaine dernière
         */
        const nembreOfCommands = await Commande.count({
            where: {
                createdAt: {
                    [Op.between]: [startOfThisWeek, endOfThisWeek],
                },
            },
        });
        /**
         * je compte le nombre de clients inscris pour la semaine dernière
         */
        const nembreOfClients = await Client.count({
            where: {
                createdAt: {
                    [Op.between]: [startOfThisWeek, endOfThisWeek],
                },
            },
        });
        /**
         * je compte le nombre de produits insérés pour ce jour
         */
        const nembreOfProducts = await Article.count({
            where: {
                createdAt: {
                    [Op.between]: [startOfToday, endOfToday],
                },
            },
        });

        /**
         * 
         * *********------- INFORMATION OF THE LAST WEEK --------*********
         *
         * */
        const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').toDate();
        const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').toDate();
        // Début de hier (00:00)
        const startOfYesterday = moment().subtract(1, 'days').startOf('day').toDate();
        // Fin de hier (23:59:59)
        const endOfYesterday = moment().subtract(1, 'days').endOf('day').toDate();

        /**
         * je cherche ensuite toutes les commandes livrées
         */
        const livredCommandsLastWeek = await Commande.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfLastWeek, endOfLastWeek],
                },
                status: "validé",
            },
        });
        /**
         * je compte le revenue d'après ces commandes
         */
        let moneyLastWeek = 0;
        livredCommandsLastWeek.map((command) => {
            moneyLastWeek += command.prixTotal;
        })

        /**
         * je compte le nombre de commandes en general pour la semaine dernière
         */
        const nembreOfCommandsLastWeek = await Commande.count({
            where: {
                createdAt: {
                    [Op.between]: [startOfLastWeek, endOfLastWeek],
                },
            },
        });
        /**
         * je compte le nombre de clients inscris pour la semaine dernière
         */
        const nembreOfClientsLastWeek = await Client.count({
            where: {
                createdAt: {
                    [Op.between]: [startOfLastWeek, endOfLastWeek],
                },
            },
        });
        /**
         * je compte le nombre de produits insérés pour ce jour
         */
        const nembreOfProductsLastWeek = await Article.count({
            where: {
                createdAt: {
                    [Op.between]: [startOfYesterday, endOfYesterday],
                },
            },
        });

        /**
         * 
         * ***********--------- CALCULATE THE RANKING ------------ ****************
         * 
         */

        let revenueRank;
        if (moneyLastWeek === 0 && moneyThisWeek === 0) {
            revenueRank = 0;
        }
        else if (moneyLastWeek === 0) {
            revenueRank = 100;
        } else {
            revenueRank = ((moneyThisWeek - moneyLastWeek) / moneyLastWeek) * 100;
        }

        let clientsRank;
        if (nembreOfClientsLastWeek === 0 && nembreOfClients === 0) {
            clientsRank = 0;
        }
        else if (nembreOfClientsLastWeek === 0) {
            clientsRank = 100;
        } else {
            clientsRank = ((nembreOfClients - nembreOfClientsLastWeek) / nembreOfClientsLastWeek) * 100;
        }

        let productsRank;
        if (nembreOfProductsLastWeek === 0 && nembreOfProducts === 0) {
            productsRank = 0;
        }
        else if (nembreOfProductsLastWeek === 0) {
            productsRank = 100;
        } else {
            productsRank = ((nembreOfProducts - nembreOfProductsLastWeek) / nembreOfProductsLastWeek) * 100;
        }

        let commandsRank;
        if (nembreOfCommandsLastWeek === 0 && nembreOfCommands === 0) {
            commandsRank = 0;
        }
        else if (nembreOfCommandsLastWeek === 0) {
            commandsRank = 100;
        } else {
            commandsRank = ((nembreOfCommands - nembreOfCommandsLastWeek) / nembreOfCommandsLastWeek) * 100;
        }

        const CardsStaitics = [
            { id: '1', Cardname: "Last week's revenue", cardVall: moneyThisWeek + " DH", rank: parseFloat(revenueRank.toFixed(2)) },
            { id: '2', Cardname: "Last week's Clients", cardVall: nembreOfClients, rank: parseFloat(clientsRank.toFixed(2)) },
            { id: '3', Cardname: "Today's Products", cardVall: nembreOfProducts, rank: parseFloat(productsRank.toFixed(2)) },
            { id: '4', Cardname: "Last week's Commandes", cardVall: nembreOfCommands, rank: parseFloat(commandsRank.toFixed(2)) }
        ];

        res.status(200).json(CardsStaitics);
    } catch (error) {
        res.status(500).json({ message: "error in getting Information of dashboard : ", error });
    }
}

const getBarGraphData = async (req, res) => {
    try {
        // Déterminer les 7 derniers jours
        const today = moment().startOf('day'); // Début du jour actuel
        const last7Days = [];

        for (let i = 0; i < 7; i++) {
            const day = today.clone().subtract(i, 'days'); // Reculer jour par jour
            last7Days.unshift(day); // Ajouter au début du tableau
        }
        // Préparer les données
        const result = await Promise.all(
            last7Days.map(async (day, index) => {
                // Récupérer les commandes pour un jour spécifique
                const startOfDay = day.toDate();
                const endOfDay = day.clone().endOf('day').toDate();

                const count = await Commande.count({
                    where: {
                        createdAt: {
                            [Op.gte]: startOfDay,
                            [Op.lte]: endOfDay,
                        },
                        status: "validé", // Filtrer par statut si nécessaire
                    },
                });

                return { day: day.format('YYYY-MM-DD'), count }; // Format de retour
            })
        );

        function getDayNameFromDate(dateString) {
            return moment(dateString).locale('fr').format('dddd');
        }

        for (i = 0; i < 7; i++) {
            result[i].day = getDayNameFromDate(result[i].day);
        }

        res.status(200).json({
            success: true,
            last7DaysCommands: result,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données du graphique :", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération des données",
            error,
        });
    }
};

const getClientStatistics = async (req, res) => {
    try {
        // Déterminer les 7 derniers jours
        const today = moment().startOf('day'); // Début du jour actuel
        const last7Days = [];

        for (let i = 0; i < 7; i++) {
            const day = today.clone().subtract(i, 'days'); // Reculer jour par jour
            last7Days.unshift(day); // Ajouter au début du tableau
        }
        // Préparer les données
        const result = await Promise.all(
            last7Days.map(async (day, index) => {
                // Récupérer les commandes pour un jour spécifique
                const startOfDay = day.toDate();
                const endOfDay = day.clone().endOf('day').toDate();

                const count = await Client.count({
                    where: {
                        createdAt: {
                            [Op.gte]: startOfDay,
                            [Op.lte]: endOfDay,
                        },
                    },
                });

                return { day: day.format('YYYY-MM-DD'), count }; // Format de retour
            })
        );

        function getDayNameFromDate(dateString) {
            return moment(dateString).locale('fr').format('dddd');
        }

        for (i = 0; i < 7; i++) {
            result[i].day = getDayNameFromDate(result[i].day);
        }

        res.status(200).json({
            success: true,
            last7DaysCommands: result,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données du graphique :", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération des données",
            error,
        });
    }
}

const getProductsStatistics = async (req, res) => {
    try {
        // Déterminer les 7 derniers jours
        const today = moment().startOf('day'); // Début du jour actuel
        const last7Days = [];

        for (let i = 0; i < 7; i++) {
            const day = today.clone().subtract(i, 'days'); // Reculer jour par jour
            last7Days.unshift(day); // Ajouter au début du tableau
        }
        // Préparer les données
        const result = await Promise.all(
            last7Days.map(async (day, index) => {
                // Récupérer les commandes pour un jour spécifique
                const startOfDay = day.toDate();
                const endOfDay = day.clone().endOf('day').toDate();

                const count = await Article.count({
                    where: {
                        createdAt: {
                            [Op.gte]: startOfDay,
                            [Op.lte]: endOfDay,
                        },
                    },
                });
                return { day: day.format('YYYY-MM-DD'), count }; // Format de retour
            })
        );

        function getDayNameFromDate(dateString) {
            return moment(dateString).locale('fr').format('dddd');
        }

        for (i = 0; i < 7; i++) {
            result[i].day = getDayNameFromDate(result[i].day);
        }

        res.status(200).json({
            success: true,
            last7DaysCommands: result,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données du graphique :", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération des données",
            error,
        });
    }
}

const verifyCurrentUser = async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {

        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findByPk(token_decode.id);
        if (admin !== null) {
            res.json({ admin: true });
        } else {
            const client = await Client.findByPk(token_decode.id);
            if (client !== null) {
                res.json({ client: true })
            } else {
                res.json({ success: false });
            }

        }
    } catch (error) {
        console.log("error in finding the id ", error)
        res.json({ success: false, error: error })
    }
}

const deleteClient = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await Client.destroy({ where: { id: id } });
        if (result) {
            res.json({ success: true, message: "Client a été supprimé" });
        } else {
            res.json({ success: false, message: "Client n'existe pas" });
        }
    } catch (error) {
        res.json({ success: false, message: "erreur sur la suppression" });
        console.log(error);
    }
}

const updateAdminPassword = async (req, res) => {
    try {
        const { id, newPassword } = req.body;
        if (!id || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "ID and new password are required"
            });
        }
        // Rest of password validation
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const admin = await Admin.update(
            { password: hashedPassword },
            { where: { id_admin: id } }
        );

        if (admin[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error('Error updating admin password:', error);
        res.status(500).json({
            success: false,
            message: "Error updating password",
            error: error.message
        });
    }
};

module.exports = {
    getAdmin,
    loginAdmin,
    getWeekInformations,
    getBarGraphData,
    verifyCurrentUser,
    deleteClient,
    getClientStatistics,
    getProductsStatistics,
    updateAdminPassword
};
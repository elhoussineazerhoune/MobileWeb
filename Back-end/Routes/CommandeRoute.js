const express = require('express');
const { getAllCommandesWithDetails, InsertCommand, updateCommande, getClientOrders, getCommandeById } = require('../Controllers/CommandeController.js');
const CommandeRouter = express.Router();

const {checkRoles} = require("../Middlewares/Middlewares.js");

CommandeRouter.get('/', getAllCommandesWithDetails);
CommandeRouter.post('/InsertCommand',InsertCommand);
CommandeRouter.post('/updatecommand',updateCommande);
CommandeRouter.get('/orders/:id', getClientOrders);
CommandeRouter.get('/byid/:id', getCommandeById);

module.exports = { CommandeRouter };
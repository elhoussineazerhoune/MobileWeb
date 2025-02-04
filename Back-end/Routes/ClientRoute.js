const express = require('express');

const { findAllClients, loginuser, createClient, registeruser, findCurrentClient, updateClient, findOneClient, updatePassword } = require('../Controllers/ClientController.js');

const ClientRouter = express.Router();


ClientRouter.get('/', findAllClients);
ClientRouter.post('/register', registeruser);
ClientRouter.post('/login', loginuser);
ClientRouter.post('/create', createClient);
ClientRouter.post('/findcurrentclient', findCurrentClient);
ClientRouter.put('/', updateClient);
ClientRouter.get('/:id', findOneClient);
ClientRouter.put('/update-password/:id', updatePassword);

module.exports = { ClientRouter };
const express = require('express');
const electron = require('electron');
const { defineRoutes } = require('./routes/index');

const app = express();
app.use(express.json());

const server = app.listen(59448);

const electronApp = electron.app || electron.remote.app;
process.chdir(electronApp.getPath('userData'));

defineRoutes(app);

module.exports = server;
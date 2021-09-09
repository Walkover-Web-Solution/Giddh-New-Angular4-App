const express = require('express');
const defineRoutes = require('./routes/index');
const electron = require('electron');

const app = express();
app.use(express.json());

const server = app.listen(8080);

const electronApp = electron.app || electron.remote.app;
process.chdir(electronApp.getPath('userData'));

defineRoutes(app);

module.exports = server;
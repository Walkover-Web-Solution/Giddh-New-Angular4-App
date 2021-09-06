const express = require('express');
const defineRoutes = require('./routes/index');

const app = express();
app.use(express.json());

const server = app.listen(8080, () => console.log(`Express server listening on port 8080`));

defineRoutes(app);

module.exports = server;
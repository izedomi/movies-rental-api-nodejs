
const winston = require('winston');
const express = require("express");
const app = express();

require('./startup/logger_startup')();
require('./startup/config')();
require('./startup/route_startup')(app);
require('./startup/db_startup')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info("Server started on ports "+ port));


module.exports = server;


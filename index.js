
const winston = require('winston');
const express = require("express");
const app = express();

require('./startup/logger_startup')();
require('./startup/config')();
require('./startup/route_startup')(app);
require('./startup/db_startup')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info("Server started on ports "+ port));


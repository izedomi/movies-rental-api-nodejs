
const winston = require('winston');
const express = require("express");
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
      info: {
        title: 'Movie Rental API Documentaion',
        version: '1.0.0',
        description: '',
        contact: {
            name: 'izedomi emmanuel',
            email: 'emmanuel.izedomi1@gmail.com'
        },
        //servers: ["http://localhost:3000"]
      },
    },
    //apis: ['./src/routes*.js'],
    apis: ['index.js', './routes/*.js']
};
  
const swaggerSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

require('./startup/logger_startup')();
require('./startup/config')();
require('./startup/route_startup')(app);
//require('./startup/prod')(app);
require('./startup/db_startup')();


const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info("Server started on ports "+ port));

module.exports = server;


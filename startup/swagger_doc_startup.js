
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

module.exports = function(app){

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
    
}



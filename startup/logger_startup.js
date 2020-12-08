
require('express-async-errors');
const winston = require('winston');
//require('winston-mongodb');


module.exports = function(){
   
   
    process.on('uncaughtException', (err) => {
        winston.error(err)
        process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
    winston.error(err)
    process.exit(1);
    });


    winston.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    winston.add(new winston.transports.File({ filename: 'info.log', level: 'info' }));
    //winston.add(new winston.transports.MongoDB({db:'mongodb://localhost/vidly'}));


}

const winston = require('winston');


module.exports = function(err, req, res, next){

    winston.error(err.message);
    //console.log(err);
    res.status(500).send("Something went wrong. Action couldn't be completed!");
}
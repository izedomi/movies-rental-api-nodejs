const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const { Schema } = require("mongoose");


function validateRental(req){

    const schema = Joi.object({
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
    }); 

    let {error} = schema.validate(req);

    return error;
}

function validateRentalId(id){
    
    const schema = Joi.object({
        rentalId: Joi.objectId().required(),
    });

    let {error} = schema.validate(id);

    return error;
}


exports.validate = validateRental;
exports.validateRentalId = validateRentalId;
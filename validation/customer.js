const Joi = require("joi");


function validateInput(req) {
    
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(3).max(50),
        isGold: Joi.boolean()
    });

    let {error} = schema.validate(req);
    return error;
}

function validateCustomerId(id){
    
    const schema = Joi.object({
        id: Joi.objectId().required(),
    });

    let {error} = schema.validate(id);

    return error;
}

exports.validate = validateInput;
exports.validateCustomerId = validateCustomerId;
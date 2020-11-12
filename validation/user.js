const Joi = require('joi');


function validateUser(user){

    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    });

    let {error} = schema.validate(user);

    return error;
}


exports.validate = validateUser;
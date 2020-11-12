const Joi = require("joi");

function validateAuth(req){    

    const schema = Joi.object({
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(3).max(1024).required()
    });


    let {error} = schema.validate(req);

    return error;

}

exports.validate = validateAuth;
const Joi = require("joi");

//validate input
function validateGenre(req){

    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });

    let {error} = schema.validate(req);

    return error;
}

exports.validate = validateGenre;


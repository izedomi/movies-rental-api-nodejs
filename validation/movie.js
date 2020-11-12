const Joi =  require("joi");


function validateMovie(req){

    var schema = Joi.object({
        title: Joi.string().required().min(3),
        genreId: Joi.string().min(3).required(),
        numberInStock: Joi.required(),
        dailyRentalRate: Joi.required()
    });

    let {error} = schema.validate(req);

    return error;
}


module.exports.validate = validateMovie;
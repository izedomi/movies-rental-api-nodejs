const Joi = require("joi");


exports.validateReturns = (req) => {
  
    const schema = Joi.object({
       movieId: Joi.objectId().required(),
       customerId: Joi.objectId().required()
    })
 
    const { error } = schema.validate(req);
 
    return error
}
 

 
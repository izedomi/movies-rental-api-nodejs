
exports.validatorMiddleware =  (val) => {
   
    return (req, res, next) => {
       
       let error = val(req.body);
       if(error) return res.status(400).send(error.details[0].message);
       next()
 
    } 
 }
 
const express = require("express");
const router = express.Router();
const { validateReturns} = require("../validation/return_validation")
const authMiddleware = require("../middleware/auth_middleware");
const {validatorMiddleware} = require("../middleware/validator_middleware");
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental_model");





//return a rental
router.post("/", [authMiddleware, validatorMiddleware(validateReturns)], async(req, res) => {


   const rental = await Rental.lookup(req.body.movieId, req.body.customerId);
  
   //no rental found
   if(!rental)
      return res.status(404).json({message: "No rental found"})

   //already processed/returned
   if(rental.dateReturned)
      return res.status(400).json({message: "Rental already processed"})

   //set return date and calculate rental fee
   rental.return()

   await rental.save()

   //update movie stock number
   await Movie.update({_id: rental.movie._id}, {$inc: {numberInStock: 1}})

   return res.status(200).json(rental)

});


module.exports = router;



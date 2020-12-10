const moment = require('moment');
const mongoose = require("mongoose");
const express = require("express");
const { Rental } = require("../models/rental_model");


const router = express.Router();

const authMiddleware = require("../middleware/auth_middleware");
const { Movie } = require("../models/movie");


// add a rental
router.post("/", authMiddleware, async(req, res) => {

   //no movie id provided
   if(!req.body.movieId)
      return res.status(400).json({message: "Bad Request. No movie id provided"})

   //no customer id provided
   if(!req.body.customerId)
      return res.status(400).json({message: "Bad request. No movie id provided"})

   const rental = await Rental.findOne({'movie._id': req.body.movieId, 'customer._id' : req.body.customerId})
   
   //no rental found
   if(!rental)
      return res.status(404).json({message: "No rental found"})

   //already process
   if(rental.dateReturned)
      return res.status(400).json({message: "Rental already processed"})
   
   //set return date
   rental.dateReturned = new Date()

   //calculate rental fee
   const daysOut = moment().diff(rental.dateCollected, 'days');
   rental.rentalFee = daysOut * rental.movie.dailyRentalRate;
   await rental.save()

   //update movie stock number
   await Movie.update({_id: rental.movie._id}, {$inc: {numberInStock: 1}})

   return res.status(200).json({message: 'successful'})

   //return res.status(401).send("Unauthorized")

});


module.exports = router;



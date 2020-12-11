
const mongoose = require("mongoose");
const moment = require('moment');

const movieSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true,
    }

});


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

//create schema
const rentalSchema = new mongoose.Schema({
    
    movie: {
        type: movieSchema,
        required: true
    },
    customer: {
        type: customerSchema,
        required: true
    },
    dateCollected: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number
    }

});


rentalSchema.statics.lookup = function(movieId, customerId){
    
    return this.findOne({'movie._id': movieId, 'customer._id' : customerId})
}

rentalSchema.methods.return = function(){

    //set return date
   this.dateReturned = new Date()

   //calculate rental fee
   const daysOut = moment().diff(this.dateCollected, 'days');
   this.rentalFee = daysOut * this.movie.dailyRentalRate;
}

//create model
const Rental = mongoose.model("Rental", rentalSchema);

//export
exports.Rental = Rental;
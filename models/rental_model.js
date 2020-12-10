
const mongoose = require("mongoose");


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

//create model
const Rental = mongoose.model("Rental", rentalSchema);

//export
exports.Rental = Rental;
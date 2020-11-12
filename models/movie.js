const mongoose = require("mongoose");
const {genreSchema} = require("./genre");


//create schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        requred: true,
        minlength: 3,
        maxlength: 255
    },
    genre: genreSchema,
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});


//define movie model
const Movie = mongoose.model("Movie", movieSchema);

exports.movieSchema = movieSchema;
exports.Movie = Movie;

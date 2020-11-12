const mongoose = require("mongoose");

//genre schema
const genreSchema = new mongoose.Schema({title: {type: String, required: true}});

//gener model
const Genre = mongoose.model("Genre", genreSchema);

//exports
exports.genreSchema = genreSchema;
exports.Genre = Genre;
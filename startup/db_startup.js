
const mongoose = require("mongoose");

module.exports = function(){
    
    mongoose.connect("mongodb://localhost/vidly", {useNewUrlParser: true, useUnifiedTopology: true},).
    then(() => console.log("customer module: connected to database sucessfully"))
   // catch(() => console.log("Customer module: error connecting to database"));
}



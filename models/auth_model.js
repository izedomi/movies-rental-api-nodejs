const mongoose = require("mongoose");


const Auth = mongoose.model("User", new mongoose.Schema({
    
     email: {
         type: String,
         required: true,
         minlength: 3,
         maxlength: 255
     },
     password: {
         type: String,
         required: true,
         minlength: 3,
         maxlength: 1024
     }

}));


exports.Auth = Auth;
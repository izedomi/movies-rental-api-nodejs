const jwt = require('jsonwebtoken');
const config = require('config');
const moongoose = require("mongoose");

let userSchema = new moongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

});

userSchema.methods.generateAuthToken = function(){

    let token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, 
        config.get("jwtPrivateKey")
    );
    return token;
}

const User = moongoose.model('User', userSchema);
exports.User = User;
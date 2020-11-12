const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();


 const {validate} = require("../validation/auth_validation");
 const {User} = require("../models/user");


//login user
router.post("/", async(req, res) => {

    //validate request        
    let error = validate(req.body);
    if(error) return res.status(400).send("Bad request. Check your inputs and try again!");

    //verify user
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid email or password");

    //verify password is correct
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("invalid passowrd");

    //generate token
    let jw = user.generateAuthToken();

    res.send(jw);

});


module.exports = router;



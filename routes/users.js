const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();

const {validate} = require("../validation/user");
const {User} = require("../models/user");
const authMiddleware = require("../middleware/auth_middleware");


/**
 * @swagger
 *
 * /api/users:
 *   post:
 *     description: Register new user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         in: body
 *         required: true
 *         type: string
 *       - name: email
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Bad request - invalide request body, user already exists
 *       500:
 *         description: Internal Server error
 */

//register new user
router.post("/",  async(req, res) => {
  
    //return res.send(req.body);

    try{

        //validate request body
        let error = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);
    
    
        //check if user already exist
        let user = User.findOne({email: req.body.email});
        if(!user) return res.status(400).send("User already registered");
    
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    
        //hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    
        //create user
        let result = await user.save();
    
        //get token
        let token = user.generateAuthToken();
    
        res.
        header('x-auth-token', token).
        send({
            _id: result._id,
            name: result.name,
            email: result.email
        });
    
        console.log(result);
      
    }
    catch(e){
        res.status(500).send({message: e});
    }
    
});


/**
   * @swagger
   * /api/users/me:
   *   get:
   *     description: Get currently logged in user details.
   *     parameters:
   *       - name: x-auth-token
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: success.
   *       400:
   *         description: Invalid token.
   *       401:
   *         description: Unauthorized User, No token provided
   *       404:
   *         description: Not found
*/
router.get("/me", authMiddleware, async(req, res) => {

    try{
        let user = await User.findById(req.user._id).select('-password');
        res.send(user);
    }
    catch(e){
        res.status(401).send("Unauthorized User");
    }
   
});


module.exports = router;
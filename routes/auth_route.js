const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();


const {validate} = require("../validation/auth_validation");
const {User} = require("../models/user");


/**
 * @swagger
 *
 * /api/auth:
 *   post:
 *     description: Login user.
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
 *         description: Bad request - invalide request body, wrong credentails(email or password)
 *       500:
 *         description: Internal Server error
 */

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




const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const {Customer} = require("../models/customer.js");
const {validate} = require("../validation/customer.js");
const {validateCustomerId} = require("../validation/customer.js");


const authMiddleware = require("../middleware/auth_middleware");
const adminMiddleware = require("../middleware/admin_middleware");

//fetch customer
router.get("/", async (req, res) => {

    const customer = await Customer.find().sort({name: 1});
    res.send(customer);
  
});


//getch a single customer
router.get("/:id", async (req, res) => {

    
    let customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(400).send("No customer with the selected Id");

    res.send(customer);
  
});

//add a customer
router.post("/", authMiddleware, async (req, res) => {

    //valide request body
    let error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); ;

    //create customer
    const customer = new Customer(
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        },
    );
    
    //save customer and return
    let result = await customer.save();
    res.send(result);
    console.log(result);
  
});

//update a customer
router.put("/:id", authMiddleware, async (req, res) => {

    //check if customer id is a valid type
    let err = validateCustomerId(req.params);
    if(err) return res.status(400).send(err.details[0].message);

    //check if customer exist
    let customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(400).send("No customer with the selected Id");

    //validate
    let error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //update
    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer.isGold = req.body.isGold;

    //save
    let result = await customer.save();
    res.send(result);
  
});

//delete a customer
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
     
    //check if customer id is a valid type
    let err = validateCustomerId(req.params);
    if(err) return res.status(400).send(err.details[0].message);

    let result = await Customer.findByIdAndDelete(req.params.id);
    if(!result) res.status(400).send("Customer with selected Id not found");
    res.send(result);

});

module.exports = router;




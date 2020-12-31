
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const {Customer} = require("../models/customer.js");
const {validate} = require("../validation/customer.js");
const {validateCustomerId} = require("../validation/customer.js");


const authMiddleware = require("../middleware/auth_middleware");
const adminMiddleware = require("../middleware/admin_middleware");

/**
   * @swagger
   * /api/customers:
   *   get:
   *     description: Returns all customers.
   *     responses:
   *       200:
   *         description: success.
   *       404:
   *         description: No found.
*/
router.get("/", async (req, res) => {

    const customer = await Customer.find().sort({name: 1});
    res.send(customer);
  
});


/**
   * @swagger
   * /api/customers:
   *   get:
   *     description: Get a single customer.
   *     parameters:
   *       - name: id
   *         in: request
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: success.
   *       400:
   *         description: Invalid customer id.
   *       500:
   *         description: Internal server error
*/
router.get("/:id", async (req, res) => {

    
    let customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(400).send("No customer with the selected Id");

    res.send(customer);
  
});


/**
 * @swagger
 *
 * /api/customers:
 *   post:
 *     description: Add new customer. Authentication required
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: name
 *         in: body
 *         required: true
 *         type: string
 *       - name: phone
 *         in: body
 *         required: true
 *         type: string
 *       - name: isGold
 *         in: body
 *         required: true
 *         default: false
 *         type: boolean
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Bad request - invalid request body, invalid token
 *       401:
 *         description: Unauthorized User, No token provided
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server error
 */
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


/**
 * @swagger
 *
 * /api/customers:
 *   put:
 *     description: Update a customer. Authentication required.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         in: request
 *         required: true
 *         type: string
 *       - name: name
 *         in: body
 *         required: true
 *         type: string
 *       - name: phone
 *         in: body
 *         required: true
 *         type: string
 *       - name: isGold
 *         in: body
 *         required: true
 *         default: false
 *         type: boolean
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Bad request - invalid request body, invalid token, invalid customer Id
 *       401:
 *         description: Unauthorized User, No token provided
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server error
 */
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

/**
 * @swagger
 *
 * /api/customers:
 *   delete:
 *     description: delete a customer. Authentication required. Admin privilege required.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         in: request
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Bad request - invalid request body, invalid token, invalid customer Id
 *       401:
 *         description: Unauthorized User, No token provided
 *       403:
 *         description: Requested resource is forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server error
 */
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
     
    //check if customer id is a valid type
    let err = validateCustomerId(req.params);
    if(err) return res.status(400).send(err.details[0].message);

    let result = await Customer.findByIdAndDelete(req.params.id);
    if(!result) res.status(400).send("Customer with selected Id not found");
    res.send(result);

});

module.exports = router;





const mongoose = require("mongoose");
const express = require("express");
const Fawn = require("fawn");

const router = express.Router();
Fawn.init(mongoose);


const { Rental } = require("../models/rental_model");
const { validate, validateRentalId } = require("../validation/rental_validation");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

const authMiddleware = require("../middleware/auth_middleware");


/**
   * @swagger
   * /api/rentals:
   *   get:
   *     description: Get list of rentals.
   *     responses:
   *       200:
   *         description: success.
   *       404:
   *         description: No found.
*/
router.get("/", async(req, res) => {
   
    let rentals = await Rental.find();
    res.send(rentals);

});

/**
 * @swagger
 *
 * /api/rentals:
 *   post:
 *     description: Add new rental. Authentication required
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: movieId
 *         in: body
 *         required: true
 *         type: string
 *       - name: customerId
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Bad request - invalid customer Id, invalid movie Id, invalid token
 *       401:
 *         description: Unauthorized User, No token provided
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server error
 */
router.post("/", authMiddleware, async(req, res) => {

    //valide request body
    let error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //validate movie id
    let movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send("Movie with Id couldn't be found");


    //validate customer id
    let customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Customer with ID couldn't be found");


    //return res.send(genre);

    //create new movie
    const rental = new Rental({
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
    });

    new Fawn.Task()
    .save("rentals", rental)
    .update("movies", {_id: movie._id}, {
        $inc: { numberInStock: -1}
    })
    .run();

    res.send(rental);

});


module.exports = router;



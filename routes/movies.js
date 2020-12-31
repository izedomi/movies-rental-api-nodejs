const express = require("express");
const mongoose = require("mongoose");

const {Movie} = require("../models/movie");
const {validate} = require("../validation/movie");
const {Genre} = require("../models/genre");

const authMiddleware = require("../middleware/auth_middleware");
const adminMiddleware = require("../middleware/admin_middleware");

const { route } = require("./users");

const router = express.Router();


/**
   * @swagger
   * /api/movies:
   *   get:
   *     description: Returns all movies.
   *     responses:
   *       200:
   *         description: success.
   *       404:
   *         description: No found.
*/
router.get("/", async(req, res) => {

    let movies = await Movie.find();
    res.send(movies);
});


/**
 * @swagger
 *
 * /api/movies:
 *   post:
 *     description: Add new movie. Authentication required
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: title
 *         in: body
 *         required: true
 *         type: string
 *       - name: genreId
 *         in: body
 *         required: true
 *         type: string
 *       - name: numberInStock
 *         in: body
 *         required: true
 *         type: number
 *       - name: dailyRentalRate
 *         in: body
 *         required: true
 *         type: number
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
 
    //validate request body
    let error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //validate genre id
    let genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send("Genre Id couldn't be found");

    //return res.send(genre);

    //create new movie
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id : genre._id,
            title : genre.title
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    //save to database
    let result = await movie.save();
    console.log(result);
    res.status(200).send(result);
        
});


/**
 * @swagger
 *
 * /api/movies:
 *   put:
 *     description: Update a movie. Authentication required
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
 *       - name: title
 *         in: body
 *         required: true
 *         type: string
 *       - name: genreId
 *         in: body
 *         required: true
 *         type: string
 *       - name: numberInStock
 *         in: body
 *         required: true
 *         type: number
 *       - name: dailyRentalRate
 *         in: body
 *         required: true
 *         type: number
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
router.put("/:id", authMiddleware, async (req, res) => {
     
    //check if movie exists
    let movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(400).send("No movie found for the selected ID");

    //check if movie genre exists
    let genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send("No genre was found for the selected movie");
    
    //validate request using JOI
    let error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    
    //update records
    movie.title = req.body.title;
    movie.genre._id = genre._id;
    movie.genre.title = genre.title;
    numberInStock = req.body.numberInStock;
    dailyRentalRate = req.body.dailyRentalRate;
    
    //save to database
    let result = await movie.save();
    res.status(200).send(result);
     
});

/**
 * @swagger
 *
 * /api/movies:
 *   delete:
 *     description: delete a movie. Authentication required. Admin privilege required.
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
router.delete("/:id", [authMiddleware, adminMiddleware], async(req, res) => {

        let result = await Movie.findByIdAndRemove(req.params.id);
        res.send(result);
});

module.exports = router;

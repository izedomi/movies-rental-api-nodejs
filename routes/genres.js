
const express = require('express');
const router = express.Router();



const {Genre} = require("../models/genre.js");
const {validate} = require("../validation/genre.js");

const authMiddleware = require("../middleware/auth_middleware");
const adminMiddleware = require("../middleware/admin_middleware");
const validateObjectIdMiddleware = require("../middleware/validateObjectId_middleware");
const mongoose = require('mongoose');


/**
   * @swagger
   * /api/genres:
   *   get:
   *     description: Returns all genres.
   *     responses:
   *       200:
   *         description: success.
   *       404:
   *         description: No found.
*/
router.get("/", async (req, res) => {

    const genres = await Genre.find().sort("title");
    res.send(genres);
   
});

/**
   * @swagger
   * /api/genres:
   *   get:
   *     description: Get a single genre.
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
   *       404:
   *         description: Not found
   *       500:
   *  
*/
router.get("/:id", validateObjectIdMiddleware, async (req, res) => {

    let genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(400).send("No genre with the selected Id");
    res.send(genre);
  
});


/**
 * @swagger
 *
 * /api/genres:
 *   post:
 *     description: Add new genre. Authentication required
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
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({title: req.body.title});
    let result = await genre.save();

    res.send(result);
    //console.log(result);
  
});


/**
 * @swagger
 *
 * /api/genres:
 *   put:
 *     description: Update a genre. Authentication required.
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
router.put("/:id", [authMiddleware, validateObjectIdMiddleware], async (req, res) => {

    //check if genre exist
    let genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(400).send("No genre with the selected Id");

    //validate
    let error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //update
    genre.title = req.body.title;

    let result = await genre.save();
    res.send(result);
 
});


/**
 * @swagger
 *
 * /api/genres:
 *   delete:
 *     description: delete a genre. Authentication required. Admin privilege required.
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
router.delete("/:id", [authMiddleware, adminMiddleware, validateObjectIdMiddleware], async (req, res) => {

    let result = await Genre.findByIdAndRemove(req.params.id, {useFindAndModify: false});
    res.status(200).send(result);
   
});

module.exports = router;
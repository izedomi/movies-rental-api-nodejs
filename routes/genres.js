
const express = require('express');
const router = express.Router();



const {Genre} = require("../models/genre.js");
const {validate} = require("../validation/genre.js");

const authMiddleware = require("../middleware/auth_middleware");
const adminMiddleware = require("../middleware/admin_middleware");
const validateObjectIdMiddleware = require("../middleware/validateObjectId_middleware");
const mongoose = require('mongoose');

//fetch genres
router.get("/", async (req, res) => {

    const genres = await Genre.find().sort("title");
    res.send(genres);
   
});


//getch a single genre
router.get("/:id", validateObjectIdMiddleware, async (req, res) => {

    let genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(400).send("No genre with the selected Id");
    res.send(genre);
  
});


//add a genre
router.post("/", authMiddleware, async (req, res) => {

    //valide request body
    let error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({title: req.body.title});
    let result = await genre.save();

    res.send(result);
    //console.log(result);
  
});

//update a genre
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

//delete a genre
router.delete("/:id", [authMiddleware, adminMiddleware, validateObjectIdMiddleware], async (req, res) => {

    let result = await Genre.findByIdAndRemove(req.params.id, {useFindAndModify: false});
    res.status(200).send(result);
   
});

module.exports = router;
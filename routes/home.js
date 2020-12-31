const express = require('express');
const router = express.Router();

    
    router.get("/", (req, res) => {
        return res.redirect('/api-docs');
        return res.send("Index page");
    });

module.exports = router;
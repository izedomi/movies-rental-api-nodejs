
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next){

    let token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Access Denied. No token provided");

    try{
        req.user = jwt.verify(token, config.get("jwtPrivateKey"));
        next();
    }
    catch(e){
        console.log(e);
        return res.status(400).send("Invalid token");
    }
    
}

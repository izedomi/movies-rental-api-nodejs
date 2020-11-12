
const config = require("config");

module.exports = function(){
    
    if(!config.get("jwtPrivateKey")){
        console.log("Jwt private not set!");
        throw new Error();
        process.exit(1);
    }

}

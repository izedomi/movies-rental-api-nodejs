const helmet = require('helmet');
const compression = require('compression');


module.exports = () => {
    app.use(helmet());
    app.use(compression());
}
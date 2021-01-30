const validator = require('../helpers/validator');

// Route method
exports.validateRoute = (req, res, next) => {
    //  Initialize validator
    let resp = validator.validate(req.body);
    
    res.status(resp.code).json(resp.details)
}
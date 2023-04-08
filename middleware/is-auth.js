const jwt = require('jsonwebtoken');
exports.requestpage = (req, res, next) => {
    try {
        token = req.get('Authorization').split(' ')[1]
        const decodeToken = jwt.verify(token, 'someStrongKey');
        req.code = 200
        req.email = decodeToken.email
    }
    catch (err) {
        req.code = 401
    }
    next();

}
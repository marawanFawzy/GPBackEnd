const jwt = require('jsonwebtoken');
exports.requestpage = (req, res, next) => {
    try {
        Atoken = req.get('Authorization').split(' ')[1]
        const decodeToken = jwt.verify(Atoken, 'someStrongKey');
        if (decodeToken.refreshOnly) {
            throw new Error("Unauthorized")
        }
        if (req.session.loggedIn) {
            req.code = 200
            req.email = decodeToken.email

        }
        else {
            throw new Error("Unauthorized")
        }
    }
    catch (err) {
        req.code = 401
    }
    next();

}
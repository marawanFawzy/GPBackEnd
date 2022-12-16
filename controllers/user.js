const path = require('path')
exports.home = (req, res, next) => {
    console.log("home");
    res.status(200).sendFile(path.join(__dirname, '..', 'views', 'home.html'));
};
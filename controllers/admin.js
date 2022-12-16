const path = require('path')
exports.adminPage = (req, res, next) => {
    console.log("admin");
    res.status(200).sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
}
const path = require('path')
exports.LoginPage = (req, res, next) => {
    console.log("login");
    res.status(200).sendFile(path.join(__dirname, '../', 'views', 'login.html'));
};
exports.OTPPage = (req, res, next) => {
    console.log("otp page");
    res.status(200).send("<h1>otp page</h1>");
};
exports.registerPage = (req, res, next) => {
    console.log("register");
    res.status(200).sendFile(path.join(__dirname, '../', 'views', 'register.html'));
};
exports.adduser = (req, res, next) => {
    console.log("user added");
    res.status(200).send("<h1>user added</h1>");
};
exports.confirmOTP = (req, res, next) => {
    console.log("confirm OTP");
    res.status(200).send("<h1>confirm OTP</h1>");
};
exports.checkuser =  (req, res, next) => {
    console.log("checkuser");
    console.log(req.body);
    const password = req.body.password;
    if (password === 'test')
        res.status(202).sendFile(path.join(__dirname, '..', 'views', 'home.html'));
    else
        res.status(401).sendFile(path.join(__dirname, '..', 'views', 'login.html'));
};
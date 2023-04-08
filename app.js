require("dotenv").config();
const express = require("express");
const cors = require('cors')
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const multer = require('multer');
const path = require("path");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

const hpp = require("hpp");

var app = express();
//app.use(cors)
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const Filter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// large file handler 
const ErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(413).json({ code: '413', pageTitle: 'large File Provided', path: '/413', isAuthenticated: req.session.isLoggedIn || false });
  } else {
    next()
  }
}
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(bodyParser.json({ type: "application/*+json", inflate: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS , GET , POST , DELETE , PATCH , PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
  next();
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(cookieParser());



app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const commonRoutes = require('./routes/common');
const userRoutes = require('./routes/doctor');
app.use(multer({ storage: fileStorage, fileFilter: Filter, limits: { fileSize: 100000 } }).single('image'), ErrorHandler);
app.use(commonRoutes); // login register otp log_out 
app.use(adminRoutes); // admin download
app.use(userRoutes); // home upload  

//not found handler 
app.use((req, res, next) => {
  if (res.statusCode === 401)
    res.render('401', { pageTitle: 'Unauthorized', path: '/401', isAuthenticated: req.session.isLoggedIn, isAdmin: req.session.isAdmin });
  else
    res.status(404).json({ code: '404', pageTitle: 'Page Not Found', path: '/404', isAuthenticated: req.session.isLoggedIn, isAdmin: req.session.isAdmin });


});
app.listen(4000)
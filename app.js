require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");

const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const date = require('date-and-time');
const multer = require('multer');

const mongoose = require("mongoose");

const path = require("path");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var cors = require("cors");
const hpp = require("hpp");

var app = express();


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + file.originalname);
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
// large handler 
const ErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(413).render('413', { pageTitle: 'large File Provided', path: '/413' });
  } else {
    next()
  }
}
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(bodyParser.json({ type: "application/*+json", inflate: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Auzhorization");
  next();
});
app.use(helmet());
app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, // enable set cookie
    exposedHeaders: ["set-cookie"],
  })
);
app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const commonRoutes = require('./routes/common');
const userRoutes = require('./routes/user');
app.use(multer({ storage: fileStorage, fileFilter: Filter, limits: { fileSize: 78982 } }).single('image'), ErrorHandler);
app.use(commonRoutes);
app.use(adminRoutes);
app.use(userRoutes);

//not found handler 
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
});

mongoose.connect(
  'mongodb+srv://marawan:01062582636@security.qhsfmpj.mongodb.net/test'
).then((result) => {
  app.listen(3000) 
  console.log('connected to database')
}).catch(err => {
  console.log(err)
})
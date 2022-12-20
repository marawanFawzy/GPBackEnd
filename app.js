require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const MongoURI = 'mongodb+srv://'+process.env.mongoName+':'+process.env.mongoPass+'@security.qhsfmpj.mongodb.net/test'
const helmet = require("helmet");
const xss = require("xss-clean");
const multer = require('multer');
const mongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const store = new mongoDBStore({
  uri: MongoURI,
  collection: 'sessions'
})
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
// large file handler 
const ErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(413).render('413', { pageTitle: 'large File Provided', path: '/413', isAuthenticated: req.session.isLoggedIn || false });
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

app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false,
  store: store,
  rolling: true,
  cookie: {
    expires: 10 * 60 * 1000,
  },
 

}))

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const commonRoutes = require('./routes/common');
const userRoutes = require('./routes/user');
const { MongoDBStore } = require("connect-mongodb-session");
app.use(multer({ storage: fileStorage, fileFilter: Filter, limits: { fileSize: 80000 } }).single('image'), ErrorHandler);
app.use(commonRoutes);
app.use(adminRoutes);
app.use(userRoutes);

//not found handler 
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404', isAuthenticated: req.session.isLoggedIn });
});

mongoose.connect(
  MongoURI
).then((result) => {
  app.listen(3000)
  console.log('connected to database')
}).catch(err => {
  console.log(err)
})
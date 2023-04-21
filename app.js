require("dotenv").config();
const express = require("express");
const cors = require('cors')
const session = require('express-session');
const MongoURI = 'mongodb+srv://' + process.env.mongoName + ':' + process.env.mongoPass + '@security.qhsfmpj.mongodb.net/test'
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const multer = require('multer');
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongoDBStore = require('connect-mongodb-session')(session)
mongoose.set('strictQuery', true);
const store = new mongoDBStore({
  uri: MongoURI,
  collection: 'sessions'
})
var bodyParser = require("body-parser");
const db = require('./util/database')
const hpp = require("hpp");

var app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
app.use(bodyParser.json({ type: "application/*+json", inflate: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS , GET , POST , DELETE , PATCH , PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
  next();
})
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));
app.use(cookieParser());

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
const adminRoutes = require("./routes/admin");
const commonRoutes = require("./routes/common");
const userRoutes = require("./routes/doctor");
// app.use(multer({ storage: fileStorage, fileFilter: Filter, limits: { fileSize: 100000 } }).single('image'), ErrorHandler);

app.use(
  cors({
    origin: "http://192.168.1.31:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, // enable set cookie
    exposedHeaders: ["set-cookie"],
  })
);

app.use(
  session({
    secret: process.env.secret,
    name: "Epidemic Prediction",
    cookie: {
      secure: false,
      maxAge: 30000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(commonRoutes); // login register otp log_out 
app.use(adminRoutes); // admin download
app.use(userRoutes); // home upload  

db.end();

mongoose.connect(
  MongoURI
).then((result) => {
  app.listen(4000)
  console.log('connected to database')
}).catch(err => {
  console.log(err)
})
require("dotenv").config();
const express = require("express");
const cors = require('cors')
const session = require('express-session');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const multer = require('multer');
const path = require("path");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

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
app.set("view engine", "ejs");
app.set("views", "views");
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
    secret: "This is a secret",
    name: "my test",
    cookie: {
      secure: false,
      maxAge: 30000 * 60 * 60 * 24 * 7, // 1 week
    },
    //store: store,
    resave: false,
    saveUninitialized: false,
  })
);
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
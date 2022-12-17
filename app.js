require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");

const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const date = require('date-and-time');

const mongoose = require("mongoose");

const path = require("path");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var cors = require("cors");
const hpp = require("hpp");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json({ type: "application/*+json", inflate: false }));
app.use(express.static(path.join(__dirname , 'public')))
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
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(authRoutes);
app.use(adminRoutes);
app.use(userRoutes);

//not found handler 
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
});


const server = app.listen(3000);
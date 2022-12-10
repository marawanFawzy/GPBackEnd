require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const mongoose = require("mongoose");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json({ type: "application/*+json", inflate: false }));
// app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
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
//add logic from here 
app.use("/" , (req , res , next )=>{
    console.log("running")
})
const server = app.listen(3000);
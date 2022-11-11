var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
require('./helpers/passport');

const cors = require("cors");
const passport = require('passport');
const bodyParser = require('body-parser');
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const result = dotenv.config()

if (result.error) {
  throw result.error
}

console.log(result.parsed.dbkey)
const mongoDB = process.env.dbkey;

// Set up default mongoose connection
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// // Establish database connection
// const result = dotenv.config()

// const mongoDB = result.parsed.dbkey;
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });



//Import the mongoose module


var createError = require("http-errors");
// var express = require("express");
var express = require("express"); // server software
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");
require("./utils/mongo-connection");

// newly added
const session = require("express-session");
const passport = require("passport");
const MongoDbStore = require("connect-mongo")(session);

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", express.static("upload"));

// Session store
let mongoStore = new MongoDbStore({
  mongooseConnection: mongoose.connection,
  collection: "sessions",
});

// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, httpOnly: false }, // 30 min
    // cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
  })
);

// Passport config
const passportInit = require("./config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

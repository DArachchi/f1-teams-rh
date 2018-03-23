// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var passport = require("passport");
var Auth0Strategy = require("passport-auth0");
var flash = require("flash");
var jwt = require("express-jwt");
var jwks = require("jwks-rsa");

dotenv.load();

// Require routes
var routes = require("./routes/index");
var user = require("./routes/user");

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
	{
	  domain: process.env.AUTH0_DOMAIN,
	  clientID: process.env.AUTH0_CLIENT_ID,
	  clientSecret: process.env.AUTH0_CLIENT_SECRET,
	  callbackURL:
		process.env.AUTH0_CALLBACK_URL
	},
	function(accessToken, refreshToken, extraParams, profile, done) {
	  // accessToken is the token to call Auth0 API (not needed in the most cases)
	  // extraParams.id_token has the JSON Web Token
	  // profile has all the information from the user
	  return done(null, profile);
	}
  );

  passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Requiring team model
var Team = require("./models/team.js");

// Initial express
var app = express();
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Make public a static directory
app.use(express.static("public"));

app.use(flash());

// Handle auth failure error messages
app.use(function(req, res, next) {
 if (req && req.query && req.query.error) {
   req.flash("error", req.query.error);
 }
 if (req && req.query && req.query.error_description) {
   req.flash("error_description", req.query.error_description);
 }
 next();
});

// Check if logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});


// Load Routes
app.use('/', routes);
app.use('/user', user);

// Database configuration with mongoose
mongoose.connect("mongodb://localhost:27017/f1-teams");

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

// GET route to pull teams from database
app.get("/teams", function(req, res) {
	Team.find({}, function(error, teams) {
		if (error) {
			res.send(error);
		}
		else {
			res.json(teams);
		}
	})
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
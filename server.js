// Dependencies
var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var passport = require("passport");
var Auth0Strategy = require("passport-auth0");

// Load in environmental variables from .env
dotenv.load();

// Require routes
var routes = require("./routes/index");

// Configure passport to use Auth0
var strategy = new Auth0Strategy({
	domain:       process.env.AUTH0_DOMAIN,
	clientID:     process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	callbackURL:  process.env.AUTH0_CALLBACK_URL,
	passReqToCallback: true
}, function(req, accessToken, refreshToken, extraParams, profile, done) {
	// accessToken is the token to call Auth0 API (not needed in the most cases)
	// extraParams.id_token has the JSON Web Token
	// profile has all the information from the user
	req.session.id_token = extraParams.id_token;
	console.log(req.session)
	return done(null, profile._json);
});

passport.use(strategy);

// This section can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Initial express
var app = express();
var PORT = process.env.PORT || 8080;

// Setup Jade view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(cookieParser());

// Set up Authentication
app.use(session({
	secret: 'shhhhhhhhh',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Make public a static directory
app.use(express.static(path.join(__dirname, 'public')));

// Load Routes
app.use('/', routes);

// Database configuration with mongoose
mongoose.connect(process.env.MONGODB_URI);

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
// Dependencies
var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var Keycloak = require("keycloak-connect");

// Load in environmental variables from .env
dotenv.load();

// Instantiate a Keycloack class
var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore});

// Require routes
var routes = require("./routes/index");

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
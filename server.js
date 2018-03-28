// Dependencies
var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var Keycloak = require("keycloak-connect");

// Require team model
var Team = require("./models/team.js");

// Load in environmental variables from .env
dotenv.load();

// Instantiate a Keycloack class and create session-store for express and keycloak middlewares
var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });

// Initialize express
var app = express();
var PORT = process.env.PORT;

// Setup Jade view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'some secret',
	resave: false,
	saveUninitialized: true,
	store: memoryStore
  }));
app.use(keycloak.middleware({
	logout: '/logout',
	admin: '/'
}));

// Routes
app.get('/', function(req,res) {
    res.render('index');
});

app.get('/teams', keycloak.protect('realm:user'), function(req,res) {
	Team.find({}, function(error, data) {
		if (error) {
			res.send(error);
		}
		else {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            res.render('teams', {user: req.user, teams: data});
		}
	})
});

app.get('/denied', function(req,res) {
    res.render('denied');
});

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
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/f1-teams");

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/api/teams", function(req, res) {
  res.json(teams);
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
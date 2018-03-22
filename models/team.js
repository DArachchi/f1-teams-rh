// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create Team schema
var TeamSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  }
});

// Create the Team model with the TeamSchema
var Team = mongoose.model("Team", TeamSchema);

// Export the model
module.exports = Team;
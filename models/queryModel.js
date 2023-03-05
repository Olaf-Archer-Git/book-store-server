const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Submited",
    enum: ["Submited", "Contacted", "In Progress", "Resolved"],
  },
});

//Export the model
module.exports = mongoose.model("Query", querySchema);

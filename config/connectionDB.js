const { default: mongoose } = require("mongoose");

mongoose.set("strictQuery", false);

const connectionDB = () => {
  try {
    const connection = mongoose.connect("mongodb://localhost:27017/bookStore");
    console.log("Database connection was successful");
  } catch (error) {
    console.log(error, "have got an error");
  }
};

module.exports = connectionDB;


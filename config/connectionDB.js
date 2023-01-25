const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const DB_PASS = process.env.DB_PASS;
const DB_USER = process.env.DB_USER;

const connectionDB = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.koy3o8h.mongodb.net/book-store?retryWrites=true&w=majority`;

mongoose
  .connect(connectionDB, { useNewUrlparser: true })
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
  console.log(err);
});

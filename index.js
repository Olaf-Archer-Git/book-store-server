const bodyParser = require("body-parser");
const express = require("express");
const connectionDB = require("./config/connectionDB");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3088;
const authRouter = require("./routes/authRoute");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRouter);

//we have to pass the middleware after routes

app.use(notFound);
// app.request(errorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Is Running On ${PORT}`);
});

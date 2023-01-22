const bodyParser = require("body-parser");
const express = require("express");
const connectionDB = require("./config/connectionDB");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3088;
const authRouter = require("./routes/authRoute");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRouter);
app.listen(PORT, () => {
  console.log(`Server Is Running On ${PORT}`);
});

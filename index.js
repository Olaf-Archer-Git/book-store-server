const express = require("express");
const connectionDB = require("./config/connectionDB");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3088;

app.use("/", (req, res) => {
  res.send("Hello From Server Side");
});

app.listen(PORT, () => {
  console.log(`Server Is Running On ${PORT}`);
});

const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3088

app.listen(PORT, () => {
  console.log(`Server Is Running On ${PORT}`)
})
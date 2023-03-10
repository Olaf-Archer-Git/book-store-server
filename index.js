const bodyParser = require("body-parser");
const express = require("express");
const connectionDB = require("./config/connectionDB");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/categoryRoute");
const discountRouter = require("./routes/discountRoute");
const orderRouter = require("./routes/orderRoute");
const queryRouter = require("./routes/queryRoute");
const uploadRouter = require("./routes/uploadRoute");

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3088;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/queries", queryRouter);
app.use("/api/category", categoryRouter);
app.use("/api/discount", discountRouter);
app.use("/api/order", orderRouter);
app.use("/api/upload", uploadRouter);

//we have to pass the middleware after routes
app.use(notFound);
// app.request(errorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Is Running On ${PORT}`);
});

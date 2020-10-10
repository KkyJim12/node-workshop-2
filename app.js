var express = require("express");
const mongoose = require("mongoose");

var app = express();

mongoose.connect("mongodb://localhost:27017/new", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});

app.get("/", (req, res) => {
  res.send("test");
});

var productRouter = require("./routes/productRoutes");
app.use(productRouter);

var userRouter = require("./routes/userRoutes");
app.use(userRouter);

module.exports = app;

var express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

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

const Product = mongoose.model("product", { name: String });

app.get("/product", async (req, res) => {
  const abc = await Product.find();
  res.send(abc);
});

app.get("/product/:id", async (req, res) => {
  const abc = await Product.findOne({ _id: req.params.id });
  res.send(abc);
});

app.post("/product", (req, res) => {
  const abc = new Product();
  abc.name = req.body.name;
  abc.save();

  res.send(abc);
});

app.put("/product/:id", async (req, res) => {
  const abc = await Product.findOne({ _id: req.params.id });
  abc.name = req.body.name;
  abc.save();

  res.send(abc);
});

app.delete("/product/:id", async (req, res) => {
  const abc = await Product.findById(req.params.id);
  abc.delete();

  res.send("delete succcess");
});

const User = mongoose.model("user", {
  name: String,
  email: String,
  password: String,
});

app.post("/register", async (req, res) => {
  const CheckEmail = validator.isEmail(req.body.email);
  const CheckPassword = validator.isLength(req.body.password, { min: 6 });

  const CheckExist = await User.findOne(
    { email: req.body.email },
    async function (err, category) {
      if (err) {
        console.log(err);
      }
      if (!category) {
        if (CheckEmail && CheckPassword) {
          const user = await new User();
          user.name = req.body.name;
          user.email = req.body.email;
          user.password = bcrypt.hashSync(req.body.password, 10);
          user.save();

          res.send(user);
        } else {
          res.send("กรอกข้อมูลให้ถูกต้อง");
        }
      }
      res.send('มีอีเมลล์นี้แล้ว');
    }
  );
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }, async function (
    err,
    user
  ) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      res.send("อีเมลล์ผิด");
    }
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);
    if (checkPassword) {
      const token = jwt.sign({ userID: user._id }, "test");
      res.send(token);
    } else {
      res.send("พาสเวิร์ดผิด");
    }
  });
});

app.get("/user-info", async (req, res) => {
  // ถ้าส่ง Headers มาในชื่อ Authorization จะมี Bearer นำหน้ามาด้วย ใหห้แยกก่อน ไม่เชื่อลอง console.log ดู
  var token = req.headers.authorization;
  // console.log(req.headers)
  var splitToken = await token.split(" ");
  // console.log(splitToken);
  // ใช้ function จำถูกแยกเป็น array ให้เลือก  Array ตำแหน่งที่
  var realToken = await splitToken["1"];
  // console.log(realToken)
  var decode = await jwt.decode(realToken);
  const user = await User.findOne(
    { _id: decode.userID },
    async (err, myuser) => {
      if (err) {
        console.log(err);
      }
      if (!myuser) {
        res.send("token ผิด");
      }
      res.send(myuser);
    }
  );
});

app.post("/change-password", async (req, res) => {
  // ถ้าส่ง Headers มาในชื่อ Authorization จะมี Bearer นำหน้ามาด้วย ใหห้แยกก่อน ไม่เชื่อลอง console.log ดู
  var token = req.headers.authorization;
  // console.log(req.headers)
  var splitToken = await token.split(" ");
  // console.log(splitToken);
  // ใช้ function จำถูกแยกเป็น array ให้เลือก  Array ตำแหน่งที่
  var realToken = await splitToken["1"];
  // console.log(realToken)
  var decode = await jwt.decode(realToken);
  const user = await User.findOne(
    { _id: decode.userID },
    async (err, myuser) => {
      if (err) {
        console.log(err);
      }
      if (!myuser) {
        res.send("token ผิด");
      }
      const changePassword = myuser;
      changePassword.password = bcrypt.hashSync(req.body.password, 10);
      changePassword.save();
      res.send("change password success");
    }
  );
});

module.exports = app;

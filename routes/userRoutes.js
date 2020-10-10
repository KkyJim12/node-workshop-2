const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Extra Library
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const CheckEmail = validator.isEmail(req.body.email);
  const CheckPassword = validator.isLength(req.body.password, { min: 6 });

  const CheckExist = await User.findOne(
    { email: req.body.email },
    async function (err, user) {
      if (err) {
        console.log(err);
      }
      if (!user) {
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
      res.send("มีอีเมลล์นี้แล้ว");
    }
  );
});

router.post("/login", async (req, res) => {
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

router.get("/user-info", async (req, res) => {
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

router.post("/change-password", async (req, res) => {
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

module.exports = router;

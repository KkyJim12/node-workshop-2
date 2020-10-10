const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/product", async (req, res) => {
  const abc = await Product.find();
  res.send(abc);
});

router.get("/product/:id", async (req, res) => {
  const abc = await Product.findOne({ _id: req.params.id });
  res.send(abc);
});

router.post("/product", (req, res) => {
  const abc = new Product();
  abc.name = req.body.name;
  abc.save();

  res.send(abc);
});

router.put("/product/:id", async (req, res) => {
  const abc = await Product.findOne({ _id: req.params.id });
  abc.name = req.body.name;
  abc.save();

  res.send(abc);
});

router.delete("/product/:id", async (req, res) => {
  const abc = await Product.findById(req.params.id);
  abc.delete();

  res.send("delete succcess");
});

module.exports = router;

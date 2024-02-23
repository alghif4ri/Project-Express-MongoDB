const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3001;

// MODELS
const Product = require("./models/product");

mongoose
  .connect("mongodb://127.0.0.1/shop_db")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hallo!");
});
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render('products/index', {products});
});

app.get('/products/:id', async(req,res)=>{
    // const {id} = req.params
    const product = await Product.findById(req.params.id)
    res.render('products/show', {product})

})

app.listen(port, () => {
  console.log(`ShopApp is running on http://localhost:${port}`);
});

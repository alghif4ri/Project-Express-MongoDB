const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const ErrorHandler = require("./ErrorHandler");
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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hallo!");
});
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All" });
  }
});

app.get("/products/create", (req, res) => {
  // throw new ErrorHandler("this custom error", 503);
  res.render("products/create");
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.redirect(`/products/${product._id}`);
});
app.get("/products/:id", async (req, res, next) => {
  try {
    // const {id} = req.params
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product });
  } catch (error) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
});
app.get("/products/:id/edit", async (req, res, next) => {
  // const {id} = req.params
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
  } catch (error) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
});

app.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    return next(new ErrorHandler("Invalid Data", 422));
  }
});

app.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  } catch (error) {
    return next(new ErrorHandler("Error Deleting Product", 500));
  }
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).send({ message });
});

app.listen(port, () => {
  console.log(`ShopApp is running on http://localhost:${port}`);
});

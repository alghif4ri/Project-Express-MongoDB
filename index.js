const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3001;

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

app.get('/', (req, res)=> {
    res.send('Hallo!')
})

app.listen(port, () => {
  console.log(`ShopApp is running on http://localhost:${port}`);
});

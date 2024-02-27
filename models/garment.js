const mongoose = require("mongoose");
const Product = require('./product')

const garmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the garment"],
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Please provide a contact"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

garmentSchema.post('findOneAndDelete', async function(garment){
    if (garment.products.length) {
        const res = await Product.deleteMany({ _id: { $in: garment.products}})
        console.log(res)
    }
})

const Garment = mongoose.model("Garment", garmentSchema);
module.exports = Garment;

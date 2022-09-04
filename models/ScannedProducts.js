const mongoose = require("mongoose");
Schema = mongoose.Schema
const ScannedProductsSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      require: false,
      default: null,
    },
    product_id: {
      type: String,
      require: false,
      default: null,
    },
    product_details:[{
      type: Schema.ObjectId,
      ref: 'Products'
   }]
  },
  {
    timestamps: true,
  }
);

const ScannedProducts = mongoose.model(
  "ScannedProducts",
  ScannedProductsSchema
);

module.exports = ScannedProducts;

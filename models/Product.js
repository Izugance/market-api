import mongoose from "mongoose";

import { Review } from "./Review.js";
import { Category } from "./Category.js";
import { toTitleCase } from "../utils/toTitleCase.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlen: 30,
      required: [true, "Please provide a product name"],
    },
    // Category names.
    categories: {
      type: [String],
      // Aside: Validation comes before pre-save hooks -> validation doesn't
      // run on changes in these hooks.
      validate: {
        validator: async (cats) => {
          let arrayNotEmpty = Array.isArray(cats) && cats.length > 0;
          cats = cats.map((cat) => {
            return toTitleCase(cat);
          });
          // Check if all exist.
          const existingCats = cats.filter(async (cat) => {
            let cat = await Category.findOne({ name: cat });
            return cat !== null;
          });
          return arrayNotEmpty && existingCats.length === cats.length;
        },
        message:
          "Please ensure categories are non-empty and that all of them exist",
      },
    },
    description: {
      type: String,
      maxlen: 200,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      min: [0, "Product price cannot be negative"],
    },
    quantity: {
      type: Number,
      min: [0, "Product quantity cannot be negative"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    virtuals: {
      isAvailable: {
        get() {
          return this.quantity > 0;
        },
      },
    },
  },
  { timestamps: true }
);

productSchema.methods.getReviews = async function () {
  const reviews = await Review.find({ productId: this._id }).select(
    "userId body createdAt"
  );
  return reviews;
};

const Product = mongoose.model("Product", productSchema);
export { Product };

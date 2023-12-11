import mongoose from "mongoose";

// Cart has a 1-to-1 association with User. Unique Carts are tied
// to unique Users. We don't grant updates on userId field ->
// security of unique Cart-User pair.
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    unique: true, // App queries Cart in terms of userId.
    required: true,
    index: true,
  },
  // Mongoose auto-converts this array's elems to a schema for me ->
  // sub-document. Sub-document validation runs.
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: [true, "Please provide a product id"],
      },
      quantity: {
        type: Number,
        min: 0,
        required: [true, "Please provide a product quantity > 0"],
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
export { Cart };

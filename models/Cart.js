import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: [true, "Please provide a product id"],
  },
  qty: {
    type: Number,
    min: 1,
    // max: 10?,
    required: [true, "Please provide a product quantity > 0"],
    alias: "quantity",
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };

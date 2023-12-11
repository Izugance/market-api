import mongoose from "mongoose";

// When an order is placed, you have to clear the cart.
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
  // Items are to be built based on cart items.
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: [true, "Please provide a product"],
      },
      quantity: {
        type: Number,
        min: 0,
        required: [true, "Please provide a product quantity > 0"],
      },
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "SETTLED", "CANCELLED"],
    default: "PENDING",
  },
});

orderSchema.methods.settle = async function () {
  this.status = "SETTLED";
  this.save();
};

orderSchema.methods.cancel = async function () {
  this.status = "CANCELLED";
  this.save();
};

const Order = mongoose.model("Order", orderSchema);
export { Order };

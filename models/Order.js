import mongoose from "mongoose";

// A user can have multiple orders, created at different times.
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: [true, "Please provide a product id"],
  },
  qty: {
    type: Number,
    min: 1,
    required: [true, "Please provide a product quantity > 0"],
    alias: "quantity",
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
      required: [true, "Please provide a user"],
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["PENDING", "SETTLED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

orderSchema.statics.settle = async function (orderId, userId) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, user: userId },
    { $set: { status: "SETTLED" } },
    { new: true }
  ).exec();
  return order;
};

orderSchema.statics.cancel = async function (orderId, userId) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, user: userId },
    { $set: { status: "CANCELLED" } },
    { new: true }
  ).exec();
  return order;
};

const Order = mongoose.model("Order", orderSchema);

export { Order };

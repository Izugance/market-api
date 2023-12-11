import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a reviewer user id"],
      index: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Please provide a product id"],
      index: true,
    },
    body: {
      type: String,
      maxlen: 200,
      required: [true, "Please provide a review body"],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export { Review };

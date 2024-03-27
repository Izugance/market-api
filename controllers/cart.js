import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { Cart } from "../models/Cart.js";
import { ResourceNotFoundError } from "../errors/resource.js";

// Adding cart items is a progressive endeavor. User carts are auto-
// created upon signup.

/** GET. */
// DO WE POPULATE THE 'PRODUCT' PATH?
const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find({ user: req.user.userId })
    .select("items")
    .exec();
  res.status(StatusCodes.OK).json({ cart });
});

// Add to cart.
/** UPDATE. */
const createCartItem = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user.userId },
    { $push: { items: req.body } },
    { runValidators: true }
  ).exec();
  res.status(StatusCodes.CREATED);
});

const updateCartItem = asyncHandler(async (req, res) => {
  // Updatable field is quantity.
  // IS THERE A WAY TO REDUCE THIS TO ONE QUERY?
  const cart = await Cart.findOne({ user: req.user.userId }).exec();
  const item = cart.items.id(req.params.itemId);
  item.qty = Number(req.body.quantity);
  await cart.save();
  res.status(StatusCodes.NO_CONTENT);
});

// LOGICALLY A DELETE, PRACTICALLY AN UPDATE.
/** DELETE. */
const deleteCartItem = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user.userId },
    { $pull: { "items._id": req.params.itemId } }
  ).exec();
  res.status(StatusCodes.NO_CONTENT);
});

// LOGICALLY A DELETE, PRACTICALLY AN UPDATE.
/** DELETE. */
const clearUserCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user.userId },
    { $set: { items: [] } }
  ).exec();
  res.status(StatusCodes.NO_CONTENT);
});

export {
  getUserCart,
  createCartItem,
  deleteCartItem,
  updateCartItem,
  clearUserCart,
};

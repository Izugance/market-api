import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { Cart } from "../models/Cart.js";
import { ResourceNotFoundError } from "../errors/resource.js";

// Adding cart items is a progressive endeavor.

/** GET. */
const getUserCart = asyncHandler(async (req, res) => {
  // Will always get unique Cart-User pair.
  const cart = await Cart.findOne({ user: req.user.userId }).exec();
  res.status(StatusCodes.OK).json({ cart });
});

// Add to cart.
/** UPDATE. */
const createCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  await Cart.updateOne(
    { user: req.user.userId },
    {
      $push: {
        items: {
          product: productId,
          quantity,
        },
      },
    }
  ).exec();
  res
    .status(StatusCodes.CREATED)
    .json({ cartItem: { product: productId, quantity } });
});

// When the client gets the user's cart, we return implicit cartItem
// ids (recall subdocument array). Hence, there's an opportunity to
// pass the implicit cartItem's id to this endpoint.
/** UPDATE. */
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  // const quantity = Number(req.body.quantity);
  const cart = await Cart.findOne({ user: req.user.userId }).exec();
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new ResourceNotFoundError(
      `Cart item '${req.params.itemId}' does not exist for user ${req.user.userId}`
    );
  }
  item.quantity = req.body.quantity; // save() -> validation.
  await cart.save();
  res.status(StatusCodes.NO_CONTENT);
});

// Though an update, logically a delete.
/** DELETE. */
const deleteCartItem = asyncHandler(async (req, res) => {
  await Cart.updateOne(
    {
      user: req.user.userId,
    },
    { $pull: { items: { product: req.params.productId } } }
  ).exec();
  // We assume client code updates displayed cart items.
  res.status(StatusCodes.NO_CONTENT);
});

// Should be called after order creation verification.
/** DELETE. */
const clearUserCart = asyncHandler(async (req, res) => {
  await Cart.updateOne(
    { user: req.user.userId },
    { $set: { items: [] } }
  ).exec();
  res.status(StatusCodes.NO_CONTENT);
});

export {
  getUserCart,
  createCartItem,
  deleteCartItem,
  updateCartItemQuantity,
  clearUserCart,
};

import express from "express";

import {
  getUserCart,
  createCartItem,
  deleteCartItem,
  updateCartItem,
  clearUserCart,
} from "../controllers/cart.js";

const cartRouter = express.Router();

// All cart operations are protected by the userAuthMiddleware.
// userId col on cart table is unique.
// Cart activities are tied to current User.
cartRouter
  .route("/")
  .get(getUserCart)
  .post(createCartItem)
  .patch(updateCartItem)
  .delete(clearUserCart);
cartRouter.route("/:itemId").delete(deleteCartItem);

export { cartRouter };

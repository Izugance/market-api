import express from "express";

import {
  getUserCart,
  createCartItem,
  deleteCartItem,
  updateCartItemQuantity,
  clearUserCart,
} from "../controllers/cart.js";

const cartRouter = express.Router();

// All cart operations are protected by the userAuthMiddleware.
// userId col on cart table is unique.
// Cart activities are tied to current User.
cartRouter.route("/").get(getUserCart);
cartRouter.route("/add").post(createCartItem);
cartRouter.route("/update").patch(updateCartItemQuantity);
cartRouter.route("/:itemId").delete(deleteCartItem);
cartRouter.route("/clear").delete(clearUserCart);

export { cartRouter };

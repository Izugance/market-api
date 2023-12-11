import asyncHandler from "express-async-handler";

import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { StatusCodes } from "http-status-codes";

// Payment options: Stripe, paypal, mastercard.

// We assume the following checkout flow: The user provides contact
// info (phone, email), shipping info (country, addy, postal code,
// city, province). Then payment, then review and place order.

// Orders are built from a user's cart.
const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId });
  const order = await Order.create({
    userId: req.user.userId,
    items: cart.items,
  }).exec();
  res.status(StatusCodes.CREATED).json({ order });
});

export { createOrder, checkoutOrder };

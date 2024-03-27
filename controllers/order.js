import asyncHandler from "express-async-handler";

import { connectDB } from "../config/db.js";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, ResourceNotFoundError } from "../errors/index.js";

// Orders are built from a user's cart.

// COUPLING ORDER CREATION WITH CART CLEARING. MAKES SENSE???
/** POST. */
const createOrder = asyncHandler(async (req, res) => {
  const connection = await connectDB();
  const session = await connection.startSession();

  session.withTransaction(async () => {
    // We return the cart's previous state (only its items). These
    // items have the same shape as the order items.
    let items = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: { items: [] } },
      { new: false }
    )
      .select("items")
      .exec();

    if (!items) {
      throw new ResourceNotFoundError(
        `No cart items to build order for user ${req.user.userId}`
      );
    }

    items = items.toArray();

    await Order.create({
      userId: req.user.userId,
      items: items,
    });
    res.status(StatusCodes.CREATED);
  });

  await session.endSession();
  await connection.close();
});

/** GET. */
const getUserOrders = asyncHandler(async () => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json(orders);
});

/** GET. */
const getOrdersAdmin = asyncHandler(async () => {
  // PROVIDE QUERY ADN OTHER PARAMS LATER.
  const orders = await Order.find(req.query);
  res.status(StatusCodes.OK).json(orders);
});

/** UPDATE. */
const cancelOrder = asyncHandler(async () => {
  const order = await Order.cancel(req.params.id, req.user.userId);
  if (!order) {
    throw new ResourceNotFoundError(
      `Order ${req.params.id} does not exist for user ${req.user.userId}`
    );
  }
  res.status(StatusCodes.NO_CONTENT);
});

/** UPDATE. */
const settleOrder = asyncHandler(async (req, res) => {
  const order = await Order.settle(req.params.id, req.user.userId);
  if (!order) {
    throw new ResourceNotFoundError(
      `Order ${req.params.id} does not exist for user ${req.user.userId}`
    );
  }
  res.status(StatusCodes.NO_CONTENT);
});

export { createOrder, cancelOrder, settleOrder };

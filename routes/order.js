import express from "express";

import { createOrder, cancelOrder, settleOrder } from "../controllers/order.js";
import { userAuthMiddleware, adminAuthMiddleware } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .post(userAuthMiddleware, createOrder)
  .get(userAuthMiddleware, getUserOrders);
orderRouter.route("/admin").get(adminAuthMiddleware, getOrdersAdmin);
orderRouter.route("/:id/cancel").patch(adminAuthMiddleware, cancelOrder);
orderRouter.route("/:id/settle").patch(adminAuthMiddleware, settleOrder);

export { orderRouter };

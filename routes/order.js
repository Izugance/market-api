import express from "express";

import { createOrder, cancelOrder, settleOrder } from "../controllers/order.js";
import { userAuthMiddleware, adminAuthMiddleware } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.route("/").post(userAuthMiddleware, createOrder);
orderRouter.route("/:id/cancel").put(adminAuthMiddleware, cancelOrder);
orderRouter.route("/:id/settle").put(adminAuthMiddleware, settleOrder);

export { orderRouter };

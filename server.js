import express from "express";
import { createServer } from "node:http";
import "dotenv/config";
import helmet from "helmet";
import xssClean from "xss-clean";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { adminAuthMiddleware, userAuthMiddleware } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { productRouter } from "./routes/product.js";
import { reviewRouter } from "./routes/review.js";
import { categoryRouter } from "./routes/category.js";
import { orderRouter } from "./routes/order.js";
import { cartRouter } from "./routes/cart.js";
import { controllerErrorHandler } from "./middleware/controller-error-handler.js";
import { endpoint404Handler } from "./middleware/endpoint-404-handler.js";

const app = express();
app.use(express.json());

// -----Sys health middleware-----
app.use(xssClean());
app.use(helmet());
app.use(cors());

// -----Routes-----
const apiRoot = "/api/v1";
app.use(apiRoot + "/auth", authRouter);
app.use(apiRoot + "/users", userRouter);
app.use(apiRoot + "/cart", userAuthMiddleware, cartRouter);
app.use(apiRoot + "/categories", adminAuthMiddleware, categoryRouter);
app.use(apiRoot + "/products", productRouter);
app.use(apiRoot + "/reviews", reviewRouter);
app.use(apiRoot + "/orders", orderRouter);

// -----Middleware-----
app.use(controllerErrorHandler);
app.use(endpoint404Handler);

// -----Server setup-----
const server = createServer(app);
const PORT = process.env.PORT || 3000;

const serve = async () => {
  try {
    await connectDB();
    server.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

serve();

import express from "express";
import { createServer } from "node:http";
import { env } from "node:process";
import helmet from "helmet";
import xssClean from "xss-clean";

import { connectDB } from "./config/db.js";
import { adminAuthMiddleware, userAuthMiddleware } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { productRouter } from "./routes/product.js";
import { reviewRouter } from "./routes/review.js";
import { categoryRouter } from "./routes/category.js";
import { orderRouter } from "./routes/order.js";
import { cartRouter } from "./routes/cart.js";

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

// -----Sys health middleware-----
app.use(cors());

// -----Server setup-----
const server = createServer(app);
const PORT = env.PORT || 3000;

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

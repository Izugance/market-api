import express from "express";

import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createReview,
} from "../controllers/product.js";
import { adminAuthMiddleware, userAuthMiddleware } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts);
productRouter.route("/create").post(adminAuthMiddleware, createProduct);
productRouter.route("/:id").get(getProduct);
productRouter.route("/:id/").patch(adminAuthMiddleware, updateProduct);
productRouter.route("/:id").delete(adminAuthMiddleware, deleteProduct);
productRouter
  .route("/:id/reviews/create")
  .post(userAuthMiddleware, createReview);

export { productRouter };

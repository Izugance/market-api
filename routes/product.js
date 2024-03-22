import express from "express";

import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";
import { adminAuthMiddleware } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(adminAuthMiddleware, createProduct);
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(adminAuthMiddleware, updateProduct)
  .delete(adminAuthMiddleware, deleteProduct);

export { productRouter };

import express from "express";

import {
  getReview,
  getProductReviews,
  deleteReview,
  createReview,
} from "../controllers/review.js";
import { userAuthMiddleware } from "../middleware/auth.js";

// Since a review is tied to a product upon its creation, we have the
// createReview route in `./product.js`.
const reviewRouter = express.Router();

reviewRouter
  .route("/:id")
  .get(getReview)
  .route("/:id")
  .delete(userAuthMiddleware, deleteReview);
reviewRouter
  .route("/:productId")
  .get(getProductReviews)
  .create(userAuthMiddleware, createReview);

export { reviewRouter };

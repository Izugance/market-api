import express from "express";

import {
  getReview,
  getProductReviews,
  deleteReview,
  createReview,
} from "../controllers/review.js";
import { userAuthMiddleware } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/:id")
  .get(getReview)
  .delete(userAuthMiddleware, deleteReview);
reviewRouter
  .route("/:productId")
  .get(getProductReviews)
  .post(userAuthMiddleware, createReview);

export { reviewRouter };

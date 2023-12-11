import express from "express";

import { getReview, deleteReview } from "../controllers/review.js";
import { userAuthMiddleware } from "../middleware/auth.js";

// Since a review is tied to a product upon its creation, we have the
// createReview route in `./product.js`.
const reviewRouter = express.Router();

reviewRouter.route("/:id").get(getReview);
reviewRouter.route("/:id").delete(userAuthMiddleware, deleteReview);

export { reviewRouter };

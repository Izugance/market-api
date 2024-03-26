import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { getDocOr404 } from "../utils/getDocOr404.js";
import { Review } from "../models/Review.js";
import { ResourceNotFoundError } from "../errors/resource.js";

// We don't allow review updates.

/** GET. */
const getProductReviews = asyncHandler(async (req, res) => {
  // DOES THIS NEED PAGINATION?
  const reviews = await Review.find({ productId: req.params.productId }).exec();
  res.status(StatusCodes.OK).json(reviews);
});

/** GET. */
const getReview = asyncHandler(async (req, res) => {
  const review = await getDocOr404(Review, { _id: req.params.id });
  res.status(StatusCodes.OK).json({ review });
});

/** POST. */
const createReview = asyncHandler(async (req, res) => {
  const review = await Review.Create(req.body);
  res.status(StatusCodes.CREATED).json({ _id: review.id });
});

/** DELETE. */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndRemove({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!review) {
    throw new ResourceNotFoundError(
      `Review with id '${req.params.id}' doesn't exist for user '${req.user.userId}'`
    );
  }
  res.status(StatusCodes.NO_CONTENT);
});

export { getReview, getProductReviews, createReview, deleteReview };

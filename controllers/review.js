import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { getDocOr404 } from "../utils/getDocOr404.js";
import { Review } from "../models/Review.js";
import { ResourceNotFoundError } from "../errors/resource.js";

const getReview = asyncHandler(async (req, res) => {
  const review = await getDocOr404(Review, { _id: req.params.id });
  res.status(StatusCodes.OK).json({ review });
});

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

export { getReview, deleteReview };

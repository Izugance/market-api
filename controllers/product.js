import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { getDocOr404 } from "../utils/getDocOr404.js";

/** POST. */
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.Create(req.body).exec();
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Product ${product.name} created` });
});

/** GET. */
const getAllProducts = asyncHandler(async (req, res) => {
  // Query var: category. Add pagination.
  let query = {};
  if (req.query.category) {
    query[categories] = req.query.category;
  }
  // REPLACE ME------------------------------------------------------------------
  const products = await Product.find(query).exec().limit(10).skip(0);
  res.status(StatusCodes.OK).json({ products });
});

/** GET. */
const getProduct = asyncHandler(async (req, res) => {
  const product = await getDocOr404(Product, { _id: req.params.id });
  res.status(StatusCodes.OK).json({ product });
});

/** PUT */
const updateProduct = asyncHandler(async (req, res) => {
  // Updatable fields: Description, price.
});

// Guarded by admin auth.
/** DELETE */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id).exec();
  res.status(StatusCodes.OK).json({ msg: `Product ${product.name} deleted` });
});

// Reviews are always tied to a product on creation.
/** POST */
const createReview = asyncHandler(async (req, res) => {
  const review = await Review.Create(req.body).exec();
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Review for product '${review.product}' created` });
});

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createReview,
};

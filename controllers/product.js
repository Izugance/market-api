import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { Product } from "../models/Product.js";
import { getDocOr404 } from "../utils/getDocOr404.js";

/** POST a new product. */
const createProduct = asyncHandler(async (req, res) => {
  await Product.Create(req.body).exec();
  res.status(StatusCodes.CREATED);
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
  const updatable = {};
  if (req.body.description) {
    updatable.description = req.body.description;
  }
  if (req.body.price) {
    updatable.price = req.body.price;
  }
  await Product.findByIdAndUpdate(req.params.id, updatable);
  res.status(StatusCodes.NO_CONTENT);
});

// Guarded by admin auth.
/** DELETE */
const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndRemove(req.params.id).exec();
  res.status(StatusCodes.NO_CONTENT);
});

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

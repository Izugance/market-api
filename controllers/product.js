import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { Product } from "../models/Product.js";
import { getDocOr404 } from "../utils/getDocOr404.js";
import { getPaginationParams } from "../utils/pagination.js";

/** POST a new product. */
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.Create(req.body);
  res.status(StatusCodes.CREATED).json({ _id: product._id });
});

/** GET. */
const getAllProducts = asyncHandler(async (req, res) => {
  // Query var: category. Add pagination.
  let query = {};
  if (req.query.category) {
    query[categories] = req.query.category;
  }
  const page = Number(req.query.page) || 1;
  const _limit = Number(req.query.limit) || 16;
  const { skip, limit } = getPaginationParams(_limit, page);
  const products = await Product.find(query).skip(skip).limit(limit).exec();
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

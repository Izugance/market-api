import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { BadRequestError } from "../errors/index.js";

/** POST. */
const createTopCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
  }).exec();
  res.status(StatusCodes.CREATED).json({ category: category.name });
});

// We use a maximum depth of 2 for each base category.
const MAX_CATEGORY_DEPTH = 2;

/** POST. */
const createSubcategory = asyncHandler(async (req, res) => {
  // Get the proposed parent and ensure it's a root.
  const parent = await Category.findById({
    parent: req.params.parentId,
  }).exec();
  if (parent.parent)
    throw new BadRequestError(
      `Attempt at creating a subcategory at a depth beyond ${MAX_CATEGORY_DEPTH}`
    );

  const category = await Category.create({
    name: req.body.name,
    parent: req.params.parentId,
  }).exec();
  res.status(StatusCodes.CREATED).json({ category: category.name });
});

// Complexity when you delete a category. Expensive.
/** DELETE. */
const deleteTopCategory = asyncHandler(async (req, res) => {
  const connection = await connectDB();
  const session = await connection.startSession();

  await session.withTranscation(async () => {
    // Reducing queries by first deleting. Transaction rolls back
    // if BadRequestError below is raised.
    let category = await Category.findByIdAndDelete(req.params.id).exec();
    // Verify category type: top.
    if (category.parent !== null) {
      throw new BadRequestError(
        `Requested category '${req.params.id}' is not a top category.`
      );
    }
    // Update products that have this as a category.
    await Product.updateMany(
      { categories: category },
      { $pull: { categories: category } }
    );
  });

  await session.endSession();
  await connection.close();
});

/** DELETE. */
const deleteSubcategory = asyncHandler(async (req, res) => {
  const connection = await connectDB();
  const session = await connection.startSession();

  await session.withTranscation(async () => {
    let category = await Category.findByIdAndDelete(req.params.id).exec();
    if (category.parent === null) {
      throw new BadRequestError(
        `Requested category '${req.params.id}' is not a top category.`
      );
    }
    // Update products that have this as a category.
    // Update products that have this as a category.
    await Product.updateMany(
      { categories: category },
      { $pull: { categories: category } }
    );
  });

  await session.endSession();
  await connection.close();
});

// Should be cached.
/** GET. */
const getCategoryStructure = asyncHandler(async (req, res) => {
  // Build category trees.
  let categoryTrees = [];
  const topCategories = await Category.find()
    .where({ parent: null })
    .sort("name")
    .exec();

  topCategories.forEach(async (category) => {
    const subcategories = await Category.find({
      parent: category._id,
    }).exec();
    categoryTrees.push({ category: subcategories });
  });

  return categoryTrees;
});

export {
  createTopCategory,
  createSubcategory,
  deleteTopCategory,
  deleteSubcategory,
  getCategoryStructure,
};

import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { BadRequestError, ResourceNotFoundError } from "../errors/index.js";

/** POST. */
const createRootCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
  });
  res.status(StatusCodes.CREATED).json({ _id: category._id });
});

/** POST. */
const createSubcategory = asyncHandler(async (req, res) => {
  // Get the proposed parent and ensure it's a root.
  const parent = await Category.findById(req.body.parentId).exec();

  if (!parent)
    throw new ResourceNotFoundError(
      `Parent category with id '${req.body.parentId}' does not exist.`
    );

  const category = await Category.create({
    name: req.body.name,
    parent: req.body.parentId,
  });
  res.status(StatusCodes.CREATED).json({ _id: category._id });
});

// Expensive!
/** DELETE */
const deleteCategory = asyncHandler(async (req, res) => {
  const connection = await connectDB();
  const session = await connection.startSession();

  session.withTransaction(async () => {
    let category = await Category.findByIdAndDelete(req.params.id).exec();
    if (!category) {
      throw new BadRequestError(
        `Category with id '${req.params.id}' does not exist.`
      );
    }
    // Link children, if they exist, to deleted category's parent.
    await Category.updateMany(
      { parent: category._id },
      { $set: { parent: category.parent } }
    );
    // Update products that have this as a category.
    await Product.updateMany(
      { categories: category },
      { $pull: { categories: category.name } }
    );
  });

  await session.endSession();
  await connection.close();
});

// Should be cached. Returns category tree to a depth of 4. (Root nodes
// are at depth 0.)
/** GET */
const getCategoryTree = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    {
      $graphLookup: {
        from: "categories",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parent",
        as: "subcats",
        maxDepth: 4,
      },
    },
    {
      $match: { parent: null },
    },
  ]);
  res.status(StatusCodes.OK).json(categories);
});

export {
  createRootCategory,
  createSubcategory,
  deleteCategory,
  getCategoryTree,
};

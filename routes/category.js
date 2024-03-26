import express from "express";

import {
  getCategoryTree,
  createSubcategory,
  createRootCategory,
  deleteCategory,
} from "../controllers/category.js";

const categoryRouter = express.Router();

// These routes are all protected by adminAuthMiddleware.
categoryRouter.route("/").get(getCategoryTree);
categoryRouter.route("/root").post(createRootCategory);
categoryRouter.route("/sub").post(createSubcategory);
categoryRouter.route("/:id").delete(deleteCategory);

export { categoryRouter };

import express from "express";

import {
  getCategoryStructure,
  createSubcategory,
  createTopCategory,
  deleteTopCategory,
  deleteSubcategory,
} from "../controllers/category.js";

const categoryRouter = express.Router();

// These routes are all protected by adminAuthMiddleware.
categoryRouter.route("/").get(getCategoryStructure);
categoryRouter.route("/top/create").post(createTopCategory);
categoryRouter.route("/sub/create").post(createSubcategory);
categoryRouter.route("/top/:id").delete(deleteTopCategory);
categoryRouter.route("/sub/:id").delete(deleteSubcategory);

export { categoryRouter };

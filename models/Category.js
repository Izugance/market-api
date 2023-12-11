import mongoose from "mongoose";
import { toTitleCase } from "../utils/toTitleCase.js";

// Top category: parent null.
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

// We save all category names in title case.
categorySchema.pre("save", function (next) {
  this.name = toTitleCase(this.name);
  next();
});

const Category = mongoose.model("Category", categorySchema);

export { Category };

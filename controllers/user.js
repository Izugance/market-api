import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { Cart } from "../models/Cart.js";
import { User } from "../models/User.js";

const deleteUser = asyncHandler(async (req, res) => {
  // Delete associated cart.
});

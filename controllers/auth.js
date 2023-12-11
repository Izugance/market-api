import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { AuthError } from "../errors/index.js";
import { Cart } from "../models/Cart.js";
import { connectDB } from "../config/db.js";
import { getDocOr404 } from "../utils/getDocOr404.js";

const registerUser = asyncHandler(async (req, res) => {
  const connection = await connectDB();
  const session = await connection.startSession();

  await session.withTransaction(async () => {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = await user.genJwt();
    // Create a user cart upon registration.
    await Cart.create({ userId: user._id });
    res.status(StatusCodes.CREATED).json({ userId: user._id, token });
  });

  session.endSession();
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await getDocOr404(User, { email });
  if (!user.comparePassword(password)) {
    throw new AuthError("Invalid login credentials");
  }
  const token = await user.genJwt();
  res.status(200).json({ userId: user._id, token });
});

// NOTE: Admin registration should be made more secure for the firm.
const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.create({ email, password });
  const token = await admin.genJwt();
  res.status(StatusCodes.CREATED).json({ AdminId: admin._id, token });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await getDocOr404(Admin, { email });
  if (!admin.comparePassword(password)) {
    throw new AuthError("Invalid login credentials");
  }
  const token = await admin.genJwt();
  res.status(200).json({ adminId: admin._id, token });
});

export { registerUser, loginUser, registerAdmin, loginAdmin };

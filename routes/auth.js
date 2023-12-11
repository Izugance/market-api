import express from "express";
import {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.route("/user/register").post(registerUser);
authRouter.route("/user/login").get(loginUser);
authRouter.route("/admin/register").post(registerAdmin);
authRouter.route("/admin/login").get(loginAdmin);

export { authRouter };

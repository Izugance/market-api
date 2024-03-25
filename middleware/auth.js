import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { env } from "node:process";

import { AuthError } from "../errors/auth.js";

const verifyAuthHeader = (header, role, secret) => {
  if (!(header && header.startsWith("Bearer"))) {
    throw new AuthError("Invalid auth header");
  }
  const token = header.split("")[1];
  try {
    let payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    throw new AuthError("Invalid auth token");
  }
};

const userAuthMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("authorization");
  let payload = verifyAuthHeader(authHeader, "user", env.USER_JWT_SECRET);
  req.user = { userId: payload.userId, token };
  next();
});

// How do we go about this?
const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("authorization");
  let payload = verifyAuthHeader(authHeader, "admin, env.ADMIN_JWT_SECRET");
  req.admin = { adminId: payload.adminId, token };
});

export { userAuthMiddleware, adminAuthMiddleware };

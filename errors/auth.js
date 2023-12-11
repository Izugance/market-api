import { StatusCodes } from "http-status-codes";

import { BaseError } from "./base.js";

class AuthError extends BaseError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export { AuthError };

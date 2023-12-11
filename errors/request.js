import { StatusCodes } from "http-status-codes";

import { BaseError } from "./base.js";

class BadRequestError extends BaseError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export { BadRequestError };

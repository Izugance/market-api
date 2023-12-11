import { StatusCodes } from "http-status-codes";

import { BaseError } from "./base.js";

class ResourceNotFoundError extends BaseError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export { ResourceNotFoundError };

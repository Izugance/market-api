import { StatusCodes } from "http-status-codes";

import { ResourceNotFoundError } from "../errors/index.js";

const endpoint404Handler = async (req, res, next) => {
  throw new ResourceNotFoundError(
    `Requested endpoint ${req.url} doesn't exist with method ${req.method}.`
  );
};

export { endpoint404Handler };

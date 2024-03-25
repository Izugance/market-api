import { StatusCodes } from "http-status-codes";

import { ResourceNotFoundError } from "../errors/index.js";

const endpoint404Handler = (err, req, res, next) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    msg: `Requested endpoint ${req.url} doesn't exist with method ${req.method}.`,
  });
};

export { endpoint404Handler };

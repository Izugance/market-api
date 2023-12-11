import { StatusCodes } from "http-status-codes";

const controllerErrorHandler = async (req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Server in progress" });
};

export { controllerErrorHandler };

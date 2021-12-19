import createHttpError from "http-errors";
import { verifyToken } from "../utils";
import { envVariables } from "../configs";
const { jwtSecret } = envVariables;
export const jwtMiddleware = async (req, res, next) => {
  try {
    console.log("authorization: ", req.headers.authorization);
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw createHttpError(403, "No token, authorization denied!");
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const userData = await verifyToken(token, jwtSecret);
      console.log(userData);
      req.user = userData;
      next();
    } catch (error) {
      console.log(error);
      throw createHttpError(error.status, error.message);
    }
  } catch (error) {
    next(error);
  }
};

import { Router } from "express";
import { shoeController } from "../controllers";
import {
  // validateRequestBody,
  // validatePermission,
  jwtMiddleware,
} from "../middlewares";

const {
  getShoeList,
  createNewShoe
} = shoeController;
const baseUrl = "/api/v1/shoes";

export const shoeRoute = Router();
// shoeRoute.use(`${baseUrl}`, jwtMiddleware);
shoeRoute
  .route(`${baseUrl}`)
  .get(getShoeList);

shoeRoute
  .route(baseUrl)
  .post(createNewShoe)

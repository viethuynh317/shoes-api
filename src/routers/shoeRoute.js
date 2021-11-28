import { Router } from "express";
import { shoeController } from "../controllers";
import {
  // validateRequestBody,
  // validatePermission,
  jwtMiddleware,
} from "../middlewares";

const {
  getShoeList,
  createNewShoe,
  getShoeById,
  updateShoeById,
  deleteShoeById,
} = shoeController;
const baseUrl = "/api/v1/shoes";

export const shoeRoute = Router();
// shoeRoute.use(`${baseUrl}`, jwtMiddleware);
shoeRoute.route(baseUrl).get(getShoeList);
shoeRoute.route(`${baseUrl}/:id`).get(getShoeById);
shoeRoute.route(baseUrl).post(createNewShoe);
shoeRoute.route(`${baseUrl}/:id`).patch(updateShoeById);
shoeRoute.route(`${baseUrl}/:id`).delete(deleteShoeById);

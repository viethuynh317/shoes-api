import { Router } from "express";
import { jwtMiddleware, validatePermission } from "../middlewares";
import { shipperController } from "../controllers";
const { checkPermission } = validatePermission;
const {
  getShippers,
  createNewShipper,
  updateShipper,
  deleteShipper,
} = shipperController;
const baseUrl = "/api/v1/shippers";
export const shipperRoute = Router();
shipperRoute.use(`${baseUrl}`, jwtMiddleware);
shipperRoute
  .route(`${baseUrl}`)
  .get(checkPermission("SHIPPER", "View"), getShippers);
shipperRoute
  .route(`${baseUrl}`)
  .post(checkPermission("SHIPPER", "Create"), createNewShipper);
shipperRoute
  .route(`${baseUrl}/:shipperId`)
  .put(checkPermission("SHIPPER", "Edit"), updateShipper);
shipperRoute
  .route(`${baseUrl}/:shipperId`)
  .delete(checkPermission("SHIPPER", "Delete"), deleteShipper);

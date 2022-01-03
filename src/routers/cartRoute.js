import { Router } from "express";
import { validatePermission, jwtMiddleware } from "../middlewares";
import { cartController } from "../controllers";
const { checkPermission } = validatePermission;
const {
  getListCartItem,
  createNewCartItem,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItem,
} = cartController;
const baseUrl = "/api/v1/carts";
export const cartRoute = Router();
cartRoute.use(`${baseUrl}`, jwtMiddleware);
cartRoute.route(`${baseUrl}`).get(getListCartItem);
cartRoute.route(`${baseUrl}`).post(createNewCartItem);
cartRoute.route(`${baseUrl}`).put(updateCartItem);
cartRoute.route(`${baseUrl}`).delete(deleteCartItem);
// cartRoute
//   .route(`${baseUrl}/:userId`)
//   .delete(checkPermission("CART_ITEM", "Delete"), deleteAllCartItem);
// cartRoute
//   .route(`${baseUrl}/:itemId`)
//   .get(checkPermission("CART_ITEM", "View"), getCartItemById);

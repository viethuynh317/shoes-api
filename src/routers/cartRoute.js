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
cartRoute
  .route(`${baseUrl}`)
  .get(checkPermission("CART", "View"), getListCartItem);
cartRoute
  .route(`${baseUrl}`)
  .post(checkPermission("CART_ITEM", "Create"), createNewCartItem);
cartRoute
  .route(`${baseUrl}`)
  .put(checkPermission("CART_ITEM", "Edit"), updateCartItem);
cartRoute
  .route(`${baseUrl}`)
  .delete(checkPermission("CART_ITEM", "Delete"), deleteCartItem);
// cartRoute
//   .route(`${baseUrl}`)
//   .delete(checkPermission("CART_ITEM", "Delete"), deleteAllCartItem);
// cartRoute
//   .route(`${baseUrl}/:itemId`)
//   .get(checkPermission("CART_ITEM", "View"), getCartItemById);

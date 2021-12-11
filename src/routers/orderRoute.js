import { Router } from "express";
import {
  validatePermission,
  jwtMiddleware,
  validateRequestBody,
} from "../middlewares";
import { orderController } from "../controllers";
const { checkPermission } = validatePermission;
const {
  getListOrder,
  getOrderById,
  order,
  purchase,
  cancelOrderById,
  updateStatus,
  getListOrderByStatus,
  momoPayment,
} = orderController;
const { validateCreateOrder, validateCreatePurchase } = validateRequestBody;
const baseUrl = "/api/v1/orders";
export const orderRoute = Router();
orderRoute.use(`${baseUrl}`, jwtMiddleware);
orderRoute
  .route(`${baseUrl}`)
  .post(validateCreateOrder, checkPermission("ORDER", "Create"), order);
orderRoute
  .route(`${baseUrl}/purchase`)
  .post(validateCreatePurchase, checkPermission("ORDER", "Create"), purchase);
// orderRoute.route(``);
orderRoute.route(`${baseUrl}/payment`).post(momoPayment);
orderRoute
  .route(`${baseUrl}`)
  .get(checkPermission("ORDER", "View"), getListOrder);
orderRoute
  .route(`${baseUrl}/:orderId`)
  .get(checkPermission("ORDER", "View"), getOrderById);
orderRoute
  .route(`${baseUrl}/:orderId`)
  .delete(checkPermission("ORDER", "Delete"), cancelOrderById);
orderRoute
  .route(`${baseUrl}/:orderId/statuses`)
  .put(checkPermission("ORDER", "Edit"), updateStatus);
orderRoute
  .route(`${baseUrl}/statuses/:statusId`)
  .get(checkPermission("ORDER", "View"), getListOrderByStatus);

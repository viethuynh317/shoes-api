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
  momoPaymentConfirm,
} = orderController;
const { validateCreateOrder, validateCreatePurchase } = validateRequestBody;
const baseUrl = "/api/v1/orders";
export const orderRoute = Router();
orderRoute.route(`${baseUrl}`).post(jwtMiddleware, validateCreateOrder, order);
orderRoute
  .route(`${baseUrl}/purchase`)
  .post(jwtMiddleware, validateCreatePurchase, purchase);
// orderRoute.route(``);
orderRoute.route(`${baseUrl}/payment`).post(jwtMiddleware, momoPayment);
orderRoute.route(`${baseUrl}/payment-confirm`).post(momoPaymentConfirm);
orderRoute.route(`${baseUrl}`).get(jwtMiddleware, getListOrder);
orderRoute.route(`${baseUrl}/:orderId`).get(jwtMiddleware, getOrderById);
orderRoute.route(`${baseUrl}/:orderId`).delete(jwtMiddleware, cancelOrderById);
orderRoute
  .route(`${baseUrl}/:orderId/statuses`)
  .put(jwtMiddleware, updateStatus);
orderRoute
  .route(`${baseUrl}/statuses/:statusId`)
  .get(jwtMiddleware, getListOrderByStatus);

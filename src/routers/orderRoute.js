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
orderRoute
  .route(`${baseUrl}`)
  .post(
    jwtMiddleware,
    validateCreateOrder,
    checkPermission("ORDER", "Create"),
    order
  );
orderRoute
  .route(`${baseUrl}/purchase`)
  .post(
    jwtMiddleware,
    validateCreatePurchase,
    checkPermission("ORDER", "Create"),
    purchase
  );
// orderRoute.route(``);
orderRoute.route(`${baseUrl}/payment`).post(jwtMiddleware, momoPayment);
orderRoute.route(`${baseUrl}/payment-confirm`).post(momoPaymentConfirm);
orderRoute
  .route(`${baseUrl}`)
  .get(jwtMiddleware, checkPermission("ORDER", "View"), getListOrder);
orderRoute
  .route(`${baseUrl}/:orderId`)
  .get(jwtMiddleware, checkPermission("ORDER", "View"), getOrderById);
orderRoute
  .route(`${baseUrl}/:orderId`)
  .delete(jwtMiddleware, checkPermission("ORDER", "Delete"), cancelOrderById);
orderRoute
  .route(`${baseUrl}/:orderId/statuses`)
  .put(jwtMiddleware, checkPermission("ORDER", "Edit"), updateStatus);
orderRoute
  .route(`${baseUrl}/statuses/:statusId`)
  .get(jwtMiddleware, checkPermission("ORDER", "View"), getListOrderByStatus);

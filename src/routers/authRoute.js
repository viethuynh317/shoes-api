import { Router } from "express";
import { authController } from "../controllers";
import { validateRequestBody, jwtMiddleware } from "../middlewares";
const {
  validateRegisterData,
  validateLoginData,
  validateChangePasswordData,
  validateResetPasswordData,
} = validateRequestBody;
const {
  registerCustomer,
  login,
  logout,
  sendResetCode,
  resetPassword,
  changePassword,
  getRoleId,
  getToken,
  confirmEmail,
} = authController;
const baseUrl = "/api/v1/auth";
export const authRoute = Router();
authRoute
  .route(`${baseUrl}/register-customer`)
  .post(validateRegisterData, registerCustomer);
authRoute.route(`${baseUrl}/login`).post(validateLoginData, login);
authRoute.route(`${baseUrl}/logout`).post(jwtMiddleware, logout);
authRoute.route(`${baseUrl}/send-reset-code`).post(sendResetCode);
authRoute
  .route(`${baseUrl}/new-password`)
  .post(validateResetPasswordData, resetPassword);
authRoute
  .route(`${baseUrl}/change-password/:id`)
  .post(jwtMiddleware, validateChangePasswordData, changePassword);
authRoute.route(`${baseUrl}/roleId`).get(jwtMiddleware, getRoleId);
authRoute.route(`${baseUrl}/token`).post(getToken);
authRoute.route(`${baseUrl}/confirm-email?`).get(confirmEmail);

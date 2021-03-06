import { Router } from "express";
import { profileController } from "../controllers";
import { jwtMiddleware } from "../middlewares";
import { validateRequestBody, validatePermission } from "../middlewares";
const { validateProfileData } = validateRequestBody;
const { checkPermission } = validatePermission;
const baseUrl = "/api/v1/profile";
const { getProfile, updateProfile, updateAvatar } = profileController;

export const profileRoute = Router();
profileRoute.use(`${baseUrl}`, jwtMiddleware);
profileRoute.route(`${baseUrl}/userId/:id`).get(getProfile);
profileRoute
  .route(`${baseUrl}/userId/:id`)
  .put(validateProfileData, updateProfile);
profileRoute.route(`${baseUrl}/avatar/:userId`).put(updateAvatar);

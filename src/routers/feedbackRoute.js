import { Router } from "express";
import { feedbackController } from "../controllers";
import { jwtMiddleware, validatePermission } from "../middlewares";
const { checkPermission } = validatePermission;
const { addFeedback, reply, getAllFeedbacks } = feedbackController;
export const feedbackRoute = Router();
const baseUrl = "/api/v1/feedbacks";
feedbackRoute.use(`${baseUrl}`, jwtMiddleware);
feedbackRoute.route(`${baseUrl}`).get(checkPermission("FEEDBACK", "View"));
feedbackRoute
  .route(`${baseUrl}`)
  .post(checkPermission("FEEDBACK", "Create"), addFeedback);
feedbackRoute
  .route(`${baseUrl}/reply`)
  .post(checkPermission("FEEDBACK", "Create"), reply);
feedbackRoute
  .route(`${baseUrl}/:shoeId`)
  .get(checkPermission("FEEDBACK", "View"), getAllFeedbacks);

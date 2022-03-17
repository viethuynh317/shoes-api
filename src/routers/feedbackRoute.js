import { Router } from "express";
import { feedbackController } from "../controllers";
import {
  jwtMiddleware,
  validatePermission,
  validateRequestBody,
} from "../middlewares";
const { checkPermission } = validatePermission;
const { addFeedback, reply, getAllFeedbacks, getFeedbackById } =
  feedbackController;
const { validateFeedbackData, validateReplyData } = validateRequestBody;
export const feedbackRoute = Router();
const baseUrl = "/api/v1/feedbacks";
// feedbackRoute.use(`${baseUrl}`, jwtMiddleware);
feedbackRoute.route(`${baseUrl}`).get(checkPermission("FEEDBACK", "View"));
feedbackRoute.route(`${baseUrl}`).post(jwtMiddleware, addFeedback);
feedbackRoute.route(`${baseUrl}/reply`).post(jwtMiddleware, reply);
feedbackRoute.route(`${baseUrl}/reply/:feedbackId`).get(getFeedbackById);
feedbackRoute.route(`${baseUrl}/:shoeId`).get(getAllFeedbacks);

import joi from "joi";
import { ShoeType, Role } from "../models";
import { validateRequest } from "../utils";
const validateRegisterData = async (req, res, next) => {
  try {
    console.log(req.body);
    const role = await Role.findOne({ roleName: "customer" });
    const registerSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required().min(6).max(50),
      // .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
      roleId: joi.number().integer().required().valid(role.id),
      fullName: joi.string().required(),
      phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
      birthday: joi.date().required(),
      address: joi.string(),
    });
    validateRequest(req, registerSchema, next);
  } catch (error) {
    next(error);
  }
};
const validateLoginData = (req, res, next) => {
  try {
    const loginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required().min(6).max(50),
      // .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
    });
    validateRequest(req, loginSchema, next);
  } catch (error) {
    next(error);
  }
};
const validateEmployeeData = async (req, res, next) => {
  try {
    console.log("employeesdata: ", req.body);
    const role = await Role.findOne({ roleName: "employee" });
    const employeeSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required().min(6).max(50),
      // .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
      roleId: joi.number().integer().required().valid(role.id),
      fullName: joi.string().required(),
      phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
      birthday: joi.date().required(),
      address: joi.string(),
    });
    validateRequest(req, employeeSchema, next);
  } catch (error) {
    next(error);
  }
};
const validateUpdateEmployeeData = async (req, res, next) => {
  try {
    console.log("employeesdata: ", req.body);
    const role = await Role.findOne({ roleName: "employee" });
    const employeeSchema = joi.object({
      email: joi.string().email().required(),
      roleId: joi.number().integer().required().valid(role.id),
      fullName: joi.string().required(),
      phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
      birthday: joi.date().required(),
      address: joi.string(),
    });
    validateRequest(req, employeeSchema, next);
  } catch (error) {
    next(error);
  }
};
const validateProfileData = async (req, res, next) => {
  try {
    console.log(req.body);
    const profileSchema = joi.object({
      fullName: joi.string().required(),
      phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
      birthday: joi.date().required(),
      address: joi.string().min(0).max(255),
    });
    validateRequest(req, profileSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateNewShoeData = async (req, res, next) => {
  try {
    console.log(req.body);
    let shoeType = await ShoeType.find({});
    shoeType = shoeType.map((x) => x.id);
    const shoeSchema = joi.object({
      typeId: joi
        .number()
        .integer()
        .required()
        .valid(...shoeType),
      name: joi.string().max(256).min(1).required(),
      unitPrice: joi.number().integer().min(1000).required(),
      discountOff: joi.number().min(0).max(100),
      description: joi.string().max(1024),
      discountMaximum: joi.number().min(0).max(joi.ref("unitPrice")),
    });
    validateRequest(req, shoeSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateResetPasswordData = async (req, res, next) => {
  try {
    const resetPasswordSchema = joi.object({
      code: joi.string().length(8).required(),
      newPassword: joi.string().required().min(6).max(50),
      // .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
      confirmPassword: joi.valid(joi.ref("newPassword")),
      email: joi.string().email().required(),
    });
    validateRequest(req, resetPasswordSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateChangePasswordData = async (req, res, next) => {
  try {
    const changePasswordSchema = joi.object({
      oldPassword: joi.string().required().min(6).max(50),
      // .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
      newPassword: joi.string().required().min(6).max(50),
      // .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
      confirmPassword: joi.valid(joi.ref("newPassword")),
    });
    validateRequest(req, changePasswordSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateCreateOrder = async (req, res, next) => {
  try {
    if (typeof req.body.cartItems != "object") {
      req.body.cartItems = [req.body.cartItems];
    }
    const orderSchema = joi.object({
      address: joi.string().required(),
      cartItems: joi.array().min(1).required(),
      paymentMethod: joi.string().required(),
    });
    validateRequest(req, orderSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateCreatePurchase = async (req, res, next) => {
  try {
    if (typeof req.body.cartItems != "object") {
      req.body.cartItems = [req.body.cartItems];
    }
    const orderSchema = joi.object({
      address: joi.string().required(),
      cartItems: joi.array().min(1).required(),
      paymentMethod: joi.string().required(),
      merchandiseSubtotal: joi.number().required().min(0),
      shipmentFee: joi.number().required().min(0),
    });
    validateRequest(req, orderSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateFeedbackData = async (req, res, next) => {
  try {
    const feedbackSchema = joi.object({
      numOfStars: joi.number().required().min(0).max(5),
      content: joi.string().required(),
      shoeId: joi.string().required(),
    });
    validateRequest(req, feedbackSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateReplyData = async (req, res, next) => {
  try {
    console.log("body: ", req.body);
    const replySchema = joi.object({
      feedbackId: joi.string().required(),
      content: joi.string().required(),
    });
    validateRequest(req, replySchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const validateRequestBody = {
  validateRegisterData,
  validateLoginData,
  validateEmployeeData,
  validateUpdateEmployeeData,
  validateProfileData,
  validateNewShoeData,
  validateChangePasswordData,
  validateResetPasswordData,
  validateCreateOrder,
  validateCreatePurchase,
  validateFeedbackData,
  validateReplyData,
};

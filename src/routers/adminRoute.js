import { Router } from "express";
import { adminController } from "../controllers";
import {
  validatePermission,
  jwtMiddleware,
  validateRequestBody,
} from "../middlewares";
const baseUrl = "/api/v1/admin";
const {
  createNewEmployee,
  getListEmployees,
  getEmpployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  getAllRoles,
  getPermissionsByRoleId,
  updatePermissionsByRoleId,
  getAllUsers,
  getPermissionsByUserId,
  updatePermissionsByUserId,
  confirmShoes,
  getListShoeConfirm,
  getRevenuesByDate,
  getRevenuesByQuater,
  getRevenueByMonth,
  getRevenuesByYear,
} = adminController;
const { validateEmployeeData, validateUpdateEmployeeData } =
  validateRequestBody;
const { isAdminRole } = validatePermission;

export const adminRoute = Router();
adminRoute.use(`${baseUrl}`, jwtMiddleware);
adminRoute.use(`${baseUrl}`, isAdminRole);
//--------------------Managing employees---------------------------//
adminRoute.route(`${baseUrl}/employees`).get(getListEmployees);
adminRoute.route(`${baseUrl}/employees/:employeeId`).get(getEmpployeeById);
adminRoute
  .route(`${baseUrl}/employees`)
  .post(validateEmployeeData, createNewEmployee);
adminRoute
  .route(`${baseUrl}/employees/:employeeId`)
  .put(validateUpdateEmployeeData, updateEmployeeById);
adminRoute.route(`${baseUrl}/employees/:employeeId`).delete(deleteEmployeeById);

//---------------------Assigning permissions of role--------------------------//
adminRoute.route(`${baseUrl}/roles`).get(getAllRoles);
adminRoute.route(`${baseUrl}/permissions/:roleId`).get(getPermissionsByRoleId);
// adminRoute.route(`${baseUrl}/permissions/:roleId/?applying`).post();
adminRoute
  .route(`${baseUrl}/permissions/:roleId/?`)
  .put(updatePermissionsByRoleId);

//---------------------Assigning permissions of user--------------------------//

adminRoute.route(`${baseUrl}/users`).get(getAllUsers);
adminRoute
  .route(`${baseUrl}/users/:userId/permissions`)
  .get(getPermissionsByUserId);
adminRoute
  .route(`${baseUrl}/users/:userId/permissions`)
  .put(updatePermissionsByUserId);

//---------------------Statisticing revenue-----------------------------------//
adminRoute.route(`${baseUrl}/revenues/days?`).get(getRevenuesByDate);
adminRoute.route(`${baseUrl}/revenues/months?`).get(getRevenueByMonth);
adminRoute.route(`${baseUrl}/revenues/quaters?`).get(getRevenuesByQuater);
adminRoute.route(`${baseUrl}/revenues/years?`).get(getRevenuesByYear);
//--------------------Confirm shoe---------------------------------------//
adminRoute.route(`${baseUrl}/shoes/:shoeId`).post(isAdminRole, confirmShoes);
adminRoute.route(`${baseUrl}/shoes`).get(isAdminRole, getListShoeConfirm);

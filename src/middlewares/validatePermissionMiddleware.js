import createHttpError from "http-errors";
import { UserPermission, RolePermission, Role, Permission } from "../models";
const isAdminRole = async (req, res, next) => {
  const user = req.user;
  try {
    // const clientRoleId = Number(req.headers.roleid);
    // if (clientRoleId != user.roleId) {
    //   throw createHttpError(409, "Conflict roleId");
    // }
    const adminRole = await Role.findOne({ roleName: "admin" });
    if (user.roleId != adminRole.id) {
      throw createHttpError(401, "you are not admin account!");
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const checkPermission = (perName, perAction) => async (req, res, next) => {
  try {
    const user = req.user;
    const clientRoleId = Number(req.headers.roleid);
    // if (user.roleId != 1 && clientRoleId != user.roleId)
    //   throw createHttpError(409, "Conflict roleId");
    // if (user.roleId == 0) {
    //   next();
    //   return;
    // }
    const permission = await Permission.findOne({
      name: perName,
      action: perAction,
    });
    const isExisted = await UserPermission.findOne({
      // userId: user._id,
      permissionId: permission._id,
    });
    console.log("permission: ", permission);
    console.log("userId: ", user._id);
    console.log(isExisted, "hello");
    if (!isExisted) {
      throw createHttpError(
        401,
        "You have not this permission or permission is banned!"
      );
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const validatePermission = {
  isAdminRole,
  checkPermission,
};

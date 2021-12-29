import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {
  User,
  Permission,
  Role,
  RolePermission,
  UserDetail,
  UserPermission,
  Shoe,
  Order,
} from "../models";
import Mongoose from "mongoose";
import {
  modifyPermissionsEffected,
  dateFunction,
  confirmResetCode,
  getResetCode,
  sendEmail,
} from "../utils";
import { envVariables } from "../configs";
const {
  initPermissions,
  addPermissionsForUserEffected,
  delPermissionsForUserEffected,
} = modifyPermissionsEffected;
const { getDaysByMonth, getMonthsByquater, getQuaterByMonth } = dateFunction;
//--------------------Managing employees---------------------------//

/**
 * @api {get} /api/v1/admin/employees Get list employees
 * @apiName Get list employees
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get list employee successfully!</code> if everything went fine.
 * @apiSuccess {Array} listEmployees <code> List of eployees</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get list employee successfully!",
 *         listEmployees: [
 *          {
 *          "_id": "6076c201228fe14534c3ca4a",
 *           "email": "employees1@gmail.com",
 *           "roleId": 2,
 *           "fullName": "Nguyen Van B",
 *           "phoneNumber": "03566382356",
 *           "birthday": "1999-04-27T17:00:00.000Z"
 *          }
 *        ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getListEmployees = async (req, res, next) => {
  try {
    const employeeRole = await Role.findOne({ roleName: "employee" });
    let listEmployees = await User.aggregate([
      {
        $lookup: {
          from: "UserDetail",
          localField: "_id",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      {
        $match: {
          roleId: employeeRole.id,
        },
      },
    ]);
    listEmployees = listEmployees.map((x) => {
      return {
        _id: x._id,
        email: x.email,
        roleId: x.roleId,
        fullName: x.userDetail[0].fullName,
        phoneNumber: x.userDetail[0].phoneNumber,
        birthday: x.userDetail[0].birthday,
        address: x.userDetail[0].address,
        isConfirmed: x.isConfirmed,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "Get list employee successfully!",
      listEmployees,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/admin/employees Create a new employee
 * @apiName Create a new eployees
 * @apiGroup Admin
 * @apiParam {String} email email's employee account
 * @apiParam {String} password password's employee account
 * @apiParam {Int} roleId role's employee required value = 2
 * @apiParam {String} fullName name's employee
 * @apiParam {String} phoneNumber phone's employee
 * @apiParam {Date} birthday birthday's employee
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Regitser success</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "Create an employee successfully!"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const createNewEmployee = async (req, res, next) => {
  const { email, password, roleId, fullName, phoneNumber, birthday, address } =
    req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      throw createHttpError(400, "This email is used by others!");
    }
    const checkRole = await Role.findOne({ id: roleId });
    if (!checkRole || checkRole.roleName != "employee") {
      throw createHttpError(401, "Role is invalid");
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashPassword,
      roleId: roleId,
    });

    await UserDetail.create({
      userId: newUser._id,
      fullName,
      phoneNumber,
      birthday: new Date(birthday),
      address,
    });
    await initPermissions(roleId, newUser._id);
    const code = await getResetCode(newUser._id, next);
    const link = `${envVariables.send_mail_path}/api/v1/auth/confirm-email?code=${code}&&userId=${newUser._id}`;
    await sendEmail(
      email,
      "Confirm Email",
      "Please click link bellow to confirm email!\n" + link,
      "",
      next
    );
    res.status(201).json({
      status: 201,
      msg: "Create a new employee successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/employees/:employeeId Get an employee by id
 * @apiName Get an employee
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Regitser success</code> if everything went fine.
 * @apiSuccess {Object} employee <code> An employee </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get an employee successfully!",
 *         employee: {
 *              _id: "6020bd895d7a6b07b0b0eef9",
 *              email: "nqp260699@gmail.com",
 *              roleId: 1,
 *              "fullName": "Nguyen van A",
 *              "phoneNumber": "0325656596",
 *              "birthday": "1999-02-04T17:00:00.000Z",
 *         }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getEmpployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await User.aggregate([
      {
        $lookup: {
          from: "UserDetail",
          localField: "_id",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      {
        $match: {
          _id: Mongoose.Types.ObjectId(employeeId),
        },
      },
    ]);
    if (!employee) {
      throw createHttpError(400, "employeeId is not exist!");
    }
    res.status(200).json({
      status: 200,
      msg: "Get an employee successfully!",
      employee: {
        _id: employee[0]._id,
        email: employee[0].email,
        role: employee[0].role,
        createdAt: employee[0].createdAt,
        phoneNumber: employee[0].userDetail[0].phoneNumber,
        fullName: employee[0].userDetail[0].fullName,
        birthday: employee[0].userDetail[0].birthday,
        isConfirmed: employee[0].isConfirmed,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/admin/employees/:employeeId Update a employee
 * @apiName Update a eployees
 * @apiGroup Admin
 * @apiParam {String} employeeId id's employee
 * @apiParam {String} email email's employee
 * @apiParam {String} password password's employee
 * @apiParam {Int} role role's employee require value = 2
 * @apiParam {String} fullName name's employee
 * @apiParam {String} phoneNumber phone's employee
 * @apiParam {Date} birthday birthday's employee
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Update successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "Update an employee successfully!"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const updateEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const { roleId, fullName, phoneNumber, birthday, address } = req.body;
    const employee = await User.findByIdAndUpdate(employeeId, {
      roleId,
    });
    if (!employee) {
      throw createHttpError(400, "An employee is not exist!");
    }
    await UserDetail.findOneAndUpdate(
      { userId: employeeId },
      {
        fullName,
        phoneNumber,
        address,
        birthday: new Date(birthday),
      }
    );
    res.status(200).json({
      status: 200,
      msg: "Update an employee successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {delete} /api/v1/admin/employees/:employeeId Delete an employee by id
 * @apiName Delete an employee
 * @apiGroup Admin
 * @apiParam {String} employeeId id's employee
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Delete successfully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get an employee successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const deleteEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await Promise.all([
      User.findByIdAndDelete(employeeId),
      UserDetail.findOneAndDelete({ userId: employeeId }),
    ]);
    let delPermissions = await UserPermission.find({ userId: employeeId });
    delPermissions = delPermissions.map((x) => x.permissionId);
    await delPermissionsForUserEffected(delPermissions, 2);
    if (!employee) {
      throw createHttpError(400, "An employee is not exist!");
    }
    res.status(200).json({
      status: 200,
      msg: "Delete an employee successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/roles Get all role of system
 * @apiName Get all role
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get all role successfully</code>
 * @apiSuccess {Array} listRoles <code> An array role </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get an employee successfully!",
 *         listRoles: [
 *          {
 *            "_id": "605be446ddf39f2daf48b701",
 *            "id": 1,
 *            "roleName": "customer"
 *           },
 *           {
 *            "_id": "605be482ddf39f2daf48b702",
 *            "id": 0,
 *            "roleName": "admin"
 *            }
 *          ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getAllRoles = async (req, res, next) => {
  try {
    const listRoles = await Role.find({ id: { $nin: [0] } });
    res.status(200).json({
      status: 200,
      msg: "Get list role successfully!",
      listRoles,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/permissions/:roleId Get permission by roleId
 * @apiName Get permissions
 * @apiGroup Admin
 * @apiParam {number} roleId id's role
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get permissions successfully</code>
 * @apiSuccess {Array} listPermissions <code> An array permissions </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get permissions by roleId successfully!",
 *         "listPermissons": {
 *             "USER_PROFILE": [
 *                 {
 *                     "_id": "606318bbae23812268265f03",
 *                     "action": "Edit",
 *                     "license": 1
 *                 },
 *                 {
 *                     "_id": "606318bbae23812268265f04",
 *                     "action": "View",
 *                     "license": 1
 *                 }
 *             ],
 *             "CHANGE_PASSWORD": [
 *                 {
 *                     "_id": "606318bbae23812268265f05",
 *                     "action": "Edit",
 *                     "license": 1
 *                 }
 *             ],
 *             "FORGOT_PASSWORD": [
 *                 {
 *                     "_id": "606318bbae23812268265f06",
 *                     "action": "Edit",
 *                     "license": 1
 *                 }
 *             ],
 *          }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getPermissionsByRoleId = async (req, res, next) => {
  try {
    const roleId = req.params.roleId;
    const allPermissions = await Permission.find({});
    const rolePermissions = await RolePermission.find({ roleId });
    const listPermissionId = rolePermissions.map((x) => String(x.permissionId));
    let listPermissions = allPermissions.map((x) => {
      let license = 0;
      if (listPermissionId.includes(String(x._id))) {
        license = 1;
      }
      return {
        ...x._doc,
        license,
      };
    });
    listPermissions = listPermissions.reduce((init, cur) => {
      if (!init[cur.name]) {
        init[cur.name] = [];
      }
      init[cur.name].push({
        _id: cur._id,
        action: cur.action,
        license: cur.license,
      });
      return init;
    }, {});
    // console.log("permissions: ", listPermissions);
    res.status(200).json({
      status: 200,
      msg: "Get list permissions of role successfully!",
      roleId,
      listPermissions,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/admin/permissions/:roleId?applying= Update permission by roleId
 * @apiName Update permissions
 * @apiGroup Admin
 * @apiParam {number} roleId id's role
 * @apiParam {Array} permissions an array of permissionId which is checked
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>update permissions successfully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update permissions by roleId successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const updatePermissionsByRoleId = async (req, res, next) => {
  try {
    const roleId = req.params.roleId;
    let permissions = await RolePermission.find({ roleId });
    permissions = permissions.map((x) => String(x.permissionId));
    const updatePermissions = req.body.permissions;
    const addPermissions = updatePermissions.filter(
      (x) => !permissions.includes(x)
    );
    const delPermissions = permissions.filter(
      (x) => !updatePermissions.includes(x)
    );
    await RolePermission.insertMany(
      addPermissions.map((x) => {
        return {
          roleId,
          permissionId: x,
        };
      })
    );
    await RolePermission.deleteMany({
      permissionId: delPermissions,
    });
    const applying = req.query.applying;

    if (applying == 1) {
      console.log("Applying = true");
      console.log(addPermissions);
      addPermissionsForUserEffected(addPermissions, roleId);
    }
    delPermissionsForUserEffected(delPermissions, roleId);
    res.status(200).json({
      status: 200,
      msg: "Update permissions of role successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/users Get all users
 * @apiName Get all user
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>update permissions successfully</code>
 * @apiSuccess {Array} listUsers <code> An array of users </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update permissions by roleId successfully!",
 *         listUsers: [
 *             {
 *                 "_id": "6062e0988b0140276c76269e",
 *                 "roleId": [
 *                     2
 *                 ],
 *                 "email": "employee2@gmail.com",
 *                 "password": "$2a$12$zitmHHPzp/LYBwGnfgRqVOGn7Amp/8zphXLAN0/TCSgtexCl6TlLG",
 *                 "userDetail": [
 *                     {
 *                         "_id": "6062e0988b0140276c76269f",
 *                         "userId": "6062e0988b0140276c76269e",
 *                         "fullName": "Nguyen van B",
 *                         "phoneNumber": "0325656596",
 *                         "birthday": "1999-02-04T17:00:00.000Z",
 *                         "__v": 0
 *                     }
 *                 ]
 *             },
 *         ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getAllUsers = async (req, res, next) => {
  try {
    let listUsers = await User.aggregate([
      {
        $lookup: {
          from: "UserDetail",
          localField: "_id",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      {
        $match: {
          roleId: {
            $ne: 0,
          },
        },
      },
      {
        $project: { __v: 0, createdAt: 0, updatedAt: 0 },
      },
    ]);
    listUsers = listUsers.map((x) => {
      return {
        _id: x._id,
        email: x.email,
        roleId: x.roleId,
        fullName: x.userDetail[0].fullName,
        phoneNumber: x.userDetail[0].phoneNumber,
        birthday: x.userDetail[0].birthday,
        address: x.userDetail[0].address,
      };
    });
    res.status(200).json({
      status: 200,

      msg: "Get List users successfully",
      listUsers,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/users/:userId/permissions Get permissions by userId
 * @apiName Get permission by userId
 * @apiGroup Admin
 * @apiParam {string} userId id of user
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get permissions successfully</code>
 * @apiSuccess {Array} listPermissions <code> An array permissions of user </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get permissions by userId successfully!",
 *         "listPermissons": {
 *             "USER_PROFILE": [
 *                 {
 *                     "_id": "606318bbae23812268265f03",
 *                     "action": "Edit",
 *                     "license": 1
 *                 },
 *                 {
 *                     "_id": "606318bbae23812268265f04",
 *                     "action": "View",
 *                     "license": 1
 *                 }
 *             ],
 *             "CHANGE_PASSWORD": [
 *                 {
 *                     "_id": "606318bbae23812268265f05",
 *                     "action": "Edit",
 *                     "license": 1
 *                 }
 *             ],
 *             "FORGOT_PASSWORD": [
 *                 {
 *                     "_id": "606318bbae23812268265f06",
 *                     "action": "Edit",
 *                     "license": 1
 *                 }
 *             ],
 *          }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getPermissionsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw createHttpError(404, "User is not existed!");
    }
    const roleId = user.roleId;
    let permissionsByRoleId = await RolePermission.aggregate([
      {
        $lookup: {
          from: "Permission",
          localField: "permissionId",
          foreignField: "_id",
          as: "permissionDetail",
        },
      },
      {
        $match: {
          roleId: roleId,
        },
      },
    ]);
    let permissionsByUserId = await UserPermission.find({ userId });
    permissionsByUserId = permissionsByUserId.map((x) =>
      String(x.permissionId)
    );
    permissionsByRoleId = permissionsByRoleId.map((x) => {
      let license = 0;
      if (permissionsByUserId.includes(String(x.permissionId))) {
        license = 1;
      }
      return {
        roleId: x.roleId,
        permissionId: x.permissionId,
        name: x.permissionDetail[0].name,
        action: x.permissionDetail[0].action,
        license,
      };
    });
    permissionsByRoleId = permissionsByRoleId.reduce((init, cur) => {
      if (!init[cur.name]) {
        init[cur.name] = [];
      }
      init[cur.name].push({
        _id: cur.permissionId,
        action: cur.action,
        license: cur.license,
      });
      return init;
    }, {});
    res.status(200).json({
      status: 200,
      msg: "Get list permissions by userId successfully!",
      listPermissons: permissionsByRoleId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/admin/users/:userId/permissions Update permissions by userId
 * @apiName Update permission by userId
 * @apiGroup Admin
 * @apiParam {string} userId id of user
 * @apiParam {array} permissions this is permissions is checked
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Update permissions successfully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update permissions by userId successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const updatePermissionsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw createHttpError(404, "User is not existed!");
    }
    const roleId = user.roleId;
    let listPermissions = await UserPermission.find({ userId }, [
      "permissionId",
    ]);
    listPermissions = listPermissions.map((x) => String(x.permissionId));
    let listUpdatePermissions = req.body.permissions;
    let listDelPermissions = listPermissions.filter(
      (x) => !listUpdatePermissions.includes(x)
    );
    let listAddPermissions = listUpdatePermissions.filter(
      (x) => !listPermissions.includes(x)
    );
    listDelPermissions = await validatePermissionInRole(
      roleId,
      listDelPermissions
    );
    listAddPermissions = await validatePermissionInRole(
      roleId,
      listAddPermissions
    );
    await UserPermission.insertMany(
      listAddPermissions.map((x) => {
        return {
          userId,
          permissionId: x,
        };
      })
    );
    await UserPermission.deleteMany({
      userId,
      permissionId: listDelPermissions,
    });
    res.status(200).json({
      status: 200,
      msg: "Update permissions for user successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validatePermissionInRole = async (roleId, listPermissions) => {
  try {
    let permissionsByRoleId = await RolePermission.find({ roleId });
    permissionsByRoleId = permissionsByRoleId.map((x) =>
      String(x.permissionId)
    );
    console.log("permissionInrole: " + permissionsByRoleId);
    return listPermissions.filter((x) => permissionsByRoleId.includes(x));
  } catch (error) {
    console.log(error);
  }
};
/**
 * @api {get} /api/v1/admin/shoes Get list of shoe to confirm
 * @apiName Get list of shoe to confirm
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get list shoe successfully</code>
 * @apiSuccess {Array} shoes <code> Array shoes which need confirming </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get list shoe successfully!",
 *         "shoes": [
 *             {
 *                 "confirmed": false,
 *                 "_id": "607d81b6e141e742289e2ecf",
 *                 "typeId": 1,
 *                 "name": "Gà sốt me",
 *                 "unitPrice": 50000,
 *                 "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618837943/qrqsf3qukvlsnzslfry2.jpg",
 *                 "createAt": "2021-04-19T13:12:22.475Z",
 *                 "__v": 0
 *             }
 *         ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getListShoeConfirm = async (req, res, next) => {
  try {
    const shoes = await Shoe.find({});
    res.status(200).json({
      status: 200,
      msg: "Get list confirm shoe successfullY!",
      shoes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/admin/shoes/:shoeId Confirm shoe when create new one
 * @apiName Confirm shoe when create new one
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code> Confirm successully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Confirm successully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const confirmShoes = async (req, res, next) => {
  try {
    const shoeId = req.params.shoeId;
    const shoe = await Shoe.findByIdAndUpdate(shoeId, {
      isConfirmed: true,
    });
    if (!shoe) throw createHttpError(400, "Not found shoe by shoeId!");
    res.status(200).json({
      status: 200,
      msg: "Confirm shoe successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/revenues/day?day= Get revenue by day
 * @apiName Get revenue by day
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code> Get revenue by day successfully!</code>
 * @apiSuccess {Object} revenues key-hour of day, value-revenue of hour(Only return the hours have revenue > 0 )
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         "msg": "Get revenue by day successfully!",
 *         "revenues": {
 *             "17": 245000
 *         }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getRevenuesByDate = async (req, res, next) => {
  try {
    let date = req.query.day;
    let startDate, endDate;
    try {
      if (!date) throw createHttpError(400, "Day is undefied!");
      // endDate = new Date(new Date(date).getTime() - 7 * 60 * 60 * 1000);
      // startDate = new Date(new Date(date).getTime() - 7 * 60 * 60 * 1000);
      endDate = new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000);
      startDate = new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000);
      console.log("Get revenue by day: " + startDate + ":" + endDate);
    } catch (error) {
      console.log("Now: " + Date.now);
      var today = new Date(Date.now() + 7 * 60 * 60 * 1000);
      endDate = new Date(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ).getTime()
      );
      startDate = new Date(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ).getTime() -
          7 * 60 * 60 * 1000
      );
      console.log("Get revenue by day1: " + startDate + ":" + endDate);
    }
    startDate.setHours(17, 0, 0, 0);
    endDate.setHours(16, 59, 59, 999);
    console.log("Get revenue by day2: " + startDate + ":" + endDate);
    let orders = await Order.find({
      updateAt: {
        $gte: startDate,
        $lt: endDate,
      },
      statusId: 4,
    });
    orders = orders.map((x) => {
      var mHour = new Date(x.updateAt).getHours() + 7;
      return {
        hour: mHour > 24 ? mHour - 24 : mHour,
        revenue: x.total,
      };
    });
    const revenues = orders.reduce((init, cur) => {
      if (!init[cur.hour]) {
        init[cur.hour] = cur.revenue;
      } else {
        init[cur.hour] = init[cur.hour] + cur.revenue;
      }
      return init;
    }, {});
    res.status(200).json({
      status: 200,
      msg: "Get revenue by day successfully!",
      revenues,
    });
    console.log(revenues);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/revenues/quaters?quater=&&year= Get revenue by quater
 * @apiName Get revenue by quater
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get revenue by quater successfully!</code>
 * @apiSuccess {Object} revenues key-month in quater, value-revenue of month(Only return the months have revenue > 0 )
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         "msg": "Get revenue by quater successfully!",
 *         "revenues": {
 *             "4": 245000,
 *             "5": 70000
 *         }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/

const getRevenuesByQuater = async (req, res, next) => {
  try {
    let quater =
      req.query.quater || getQuaterByMonth(new Date(Date.now()).getMonth()) + 1;
    let year = req.query.year || new Date(Date.now()).getFullYear();
    quater = Number(quater);
    year = Number(year);
    const months = getMonthsByquater(quater);
    console.log(months);
    let startDate = new Date(year, months[0] - 1, 1);
    let endDate = new Date(year, months[2] - 1, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    console.log(startDate, endDate);
    let orders = await Order.find({
      updatedAt: {
        $gte: startDate,
        $lt: endDate,
      },
      statusId: 4,
    });
    orders = orders.map((x) => {
      return {
        month: new Date(x.updatedAt).getMonth() + 1,
        revenue: x.total,
      };
    });
    const revenues = orders.reduce((init, cur) => {
      if (!init[cur.month]) init[cur.month] = cur.revenue;
      else init[cur.month] = init[cur.month] + cur.revenue;
      return init;
    }, {});
    console.log(revenues);
    res.status(200).json({
      status: 200,
      msg: "Get revenues by quater successfully!",
      revenues,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/revenues/months?month=&&year= Get revenue by month
 * @apiName Get revenue by month
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code> Get revenue by month successfully!</code>
 * @apiSuccess {Object} revenues key-day in month, value-revenue of day(Only return the days have revenue > 0 )
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         "msg": "Get revenue by month successfully!",
 *          "revenues": {
 *             "27": 245000,
 *             "28": 70000
 *         }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getRevenueByMonth = async (req, res, next) => {
  try {
    console.log(req.query);
    let month = req.query.month || new Date(Date.now()).getMonth() + 1;
    let year = req.query.year || new Date(Date.now()).getFullYear();
    month = Number(month);
    year = Number(year);
    let startDate = new Date(year, month - 1, 1);
    let endDate = new Date(year, month, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    console.log(startDate, endDate);
    let orders = await Order.find({
      updatedAt: {
        $gte: startDate,
        $lt: endDate,
      },
      statusId: 4,
    });
    orders = orders.map((x) => {
      return {
        date: new Date(x.updatedAt).getDate(),
        revenue: x.total,
      };
    });
    const revenues = orders.reduce((init, cur) => {
      if (!init[cur.date]) init[cur.date] = cur.revenue;
      else init[cur.date] = init[cur.date] + cur.revenue;
      return init;
    }, {});
    console.log(revenues);
    res.status(200).json({
      status: 200,
      msg: "Get revenues by month successfully!",
      revenues,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/revenues/years?year= Get revenue by year
 * @apiName Get revenue by year
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code> Get revenue by year successfully!</code>
 * @apiSuccess {Object} revenues key-month in year, value-revenue of month(Only return the months have revenue > 0 )
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         "msg": "Get revenue by year successfully!",
 *           "revenues": {
 *             "4": 315000
 *         }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getRevenuesByYear = async (req, res, next) => {
  try {
    console.log(req.query);
    let year = req.query.year || new Date(Date.now()).getFullYear();
    year = Number(year);
    let startDate = new Date(year, 0, 1);
    let endDate = new Date(year, 11, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    console.log(startDate, endDate);
    let orders = await Order.find({
      updatedAt: {
        $gte: startDate,
        $lt: endDate,
      },
      statusId: 4,
    });
    orders = orders.map((x) => {
      return {
        month: new Date(x.updatedAt).getMonth() + 1,
        revenue: x.total,
      };
    });
    const revenues = orders.reduce((init, cur) => {
      if (!init[cur.month]) init[cur.month] = cur.revenue;
      else init[cur.month] = init[cur.month] + cur.revenue;
      return init;
    }, {});
    console.log(revenues);
    res.status(200).json({
      status: 200,
      msg: "Get revenues by year successfully!",
      revenues,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const adminController = {
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
  getListShoeConfirm,
  confirmShoes,
  getRevenuesByDate,
  getRevenuesByQuater,
  getRevenueByMonth,
  getRevenuesByYear,
};

import createHttpError from "http-errors";
import { Shipper, UserDetail } from "../models";
/**
 * @api {get} /api/v1/shippers Get list shippers
 * @apiName Get list shippers
 * @apiGroup Shipper
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get list shippers successfully!</code> if everything went fine.
 * @apiSuccess {Array} shippers <code> List of shippers</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "get list shippers successfully!",
 *         shippers: [
 *          {
 *           "_id": "6090c7583b9d9331b4e08bf2",
 *           "status": "Rảnh",
 *           "fullName": "Lê Văn Tùng",
 *           "phoneNumber": "0336646997",
 *           "address": "32 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
 *           "birthday": "1998-06-28T17:00:00.000Z"
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
const getShippers = async (req, res, next) => {
  try {
    // const shippers = await Shipper.find({});
    let shippers = await Shipper.aggregate([
      {
        $lookup: {
          from: "UserDetail",
          localField: "userDetailId",
          foreignField: "_id",
          as: "userDetail",
        },
      },
    ]);
    shippers = shippers.map((x) => {
      return {
        _id: x._id,
        status: x.isIdle ? "Rảnh" : "Đang giao hàng",
        fullName: x.userDetail[0].fullName,
        phoneNumber: x.userDetail[0].phoneNumber,
        address: x.userDetail[0].address,
        birthday: x.userDetail[0].birthday,
        isIdle: x.isIdle,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "get list shippers successfully!",
      shippers,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/shippers Create a new shipper
 * @apiName Create a new eployees
 * @apiGroup Shipper
 * @apiParam {String} fullName shipper's name
 * @apiParam {String} phoneNumber shipper's phone number
 * @apiParam {Date} birthday shipper's birthday
 * @apiParam {String} address shipper's address
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Create an shipper successfully!</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "Create an shipper successfully!"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const createNewShipper = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, birthday, address, isIdle } = req.body;
    const userDetail = await UserDetail.create({
      fullName,
      phoneNumber,
      birthday,
      address,
    });
    await Shipper.create({
      userDetailId: userDetail._id,
      isIdle: !!isIdle,
    });

    res.status(201).json({
      status: 201,
      msg: "Create new shipper successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/shippers/:shipperId Update shipper's Information
 * @apiName Update shipper's Information
 * @apiGroup Shipper
 * @apiParam {String} fullName shipper's name
 * @apiParam {String} phoneNumber shipper's phone number
 * @apiParam {Date} birthday shipper's birthday
 * @apiParam {String} address shipper's address
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Update an shipper successfully!</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update an shipper successfully!"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const updateShipper = async (req, res, next) => {
  try {
    const shipperId = req.params.shipperId;
    const { fullName, phoneNumber, birthday, address, isIdle } = req.body;
    const shipper = await Shipper.findById(shipperId);
    if (!shipper) throw createHttpError(404, "Not found shipper!");
    await UserDetail.findByIdAndUpdate(shipper.userDetailId, {
      fullName,
      phoneNumber,
      birthday,
      address,
    });
    await Shipper.findByIdAndUpdate(shipperId, {
      isIdle: !!isIdle,
    });

    res.status(200).json({
      status: 200,
      msg: "Update shipper successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {delete} /api/v1/shippers/:shipperId Delete shipper
 * @apiName Delete shipper
 * @apiGroup Shipper
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Delete shipper successfully!</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Delete shipper successfully!"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const deleteShipper = async (req, res, next) => {
  try {
    const shipperId = req.params.shipperId;
    const shipper = await Shipper.findByIdAndRemove(shipperId);
    if (!shipper) throw createHttpError(404, "Not found shipper!");

    res.status(200).json({
      status: 200,
      msg: "Delete shipper successfuly!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const shipperController = {
  getShippers,
  updateShipper,
  createNewShipper,
  deleteShipper,
};

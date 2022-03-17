import createHttpError from "http-errors";
import Mongoose from "mongoose";
import { MySocket } from "../configs";
import { Feedback, Shoe, Reply, User, UserDetail } from "../models";
/**
 * @api {post} /api/v1/feedbacks Add feebback
 * @apiName Add feebback
 * @apiGroup Feedback
 * @apiParam {String} shoeId shoe's shoeId
 * @apiParam {String} content feedback's content
 * @apiParam {Int} numOfStars feedback's numOfStars
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Add feedback successfully!</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "Add feedback successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const addFeedback = async (req, res, next) => {
  try {
    const user = req.user;
    const userDetail = await UserDetail.findOne({ userId: user._id });
    let { numOfStars, content, shoeId } = req.body;
    numOfStars = Number(numOfStars);
    const shoe = await Shoe.findById(shoeId);
    if (!shoe) throw createHttpError(404, "The id of shoe is invalid!");
    let shoeNumOfStars = shoe.numOfStars || 0;
    let numOfFeedbacks = shoe.numOfFeedbacks || 0;
    shoeNumOfStars = shoeNumOfStars * numOfFeedbacks;
    numOfFeedbacks++;
    shoeNumOfStars = (numOfStars + shoeNumOfStars) / numOfFeedbacks;
    await Shoe.findByIdAndUpdate(shoeId, {
      numOfStars: shoeNumOfStars,
      numOfFeedbacks,
    });
    await Feedback.create({
      shoeId,
      userName: userDetail.fullName,
      content,
      numOfStars,
    });
    const io = MySocket.prototype.getInstance();
    io.emit("GetFeedbackById");
    res.status(200).json({
      status: 200,
      msg: "Create feedback successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/feedbacks/reply Reply feebback
 * @apiName Reply feebback
 * @apiGroup Feedback
 * @apiParam {String} feedbackId Feedback's feedbackId
 * @apiParam {String} content reply's content
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>reply feedback successfully!</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "reply feedback successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const reply = async (req, res, next) => {
  try {
    const userDetail = await UserDetail.findOne({ userId: req.user._id });
    const { feedbackId, content } = req.body;
    const newReply = Reply({
      userName: userDetail.fullName,
      content,
    });
    await Feedback.findByIdAndUpdate(feedbackId, {
      $push: {
        reply: newReply,
      },
    });
    const io = MySocket.prototype.getInstance();
    io.emit("GetReplyById");
    res.status(200).json({
      status: 200,
      msg: "Reply success!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/feedbacks/:shoeId Get all feebbacks
 * @apiName Get all feebbacks
 * @apiGroup Feedback
 * @apiParam {String} shoeId shoe's id
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get all feedbacks successfully!</code> if everything went fine.
 * @apiSussess {Array} feedbacks List of feedbacks
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get all feedbacks successfully!",
 *         feedbacks: [
 *               {
 *                   "_id": "607bb68228b9b81957c0aa3c",
 *                   "userName": "Nguyen Van B",
 *                   "content": "",
 *                   "numOfStars": 3,
 *                   "reply": [
 *                       {
 *                           "_id": "6093f7772d771f2db023aa7b",
 *                           "userName": "Viet Huynh",
 *                           "content": "Đánh giá 5 sao",
 *                           "createAt": "2021-05-06T14:04:39.726Z"
 *                       }
 *                   ]
 *               },
 *               {
 *                   "_id": "6086337c692e3429b8b8a37a",
 *                   "userName": "Nguyen Van B",
 *                   "content": "Đồ ăn rất ngon",
 *                   "numOfStars": 4,
 *                   "createAt": "2021-04-26T03:29:00.439Z",
 *                   "reply": [
 *                       {
 *                           "_id": "60863bd9168d1d075cc6226c",
 *                           "userName": "Nguyen Van B",
 *                           "content": "Đồ ăn rất ngon. Đã mua lần 2",
 *                           "createAt": "2021-04-26T04:04:41.143Z"
 *                       }
 *                   ]
 *               }
 *           ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getAllFeedbacks = async (req, res, next) => {
  try {
    const { shoeId } = req.params;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const start = (page - 1) * perPage;
    let feedbacks = await Feedback.find({ shoeId }).skip(start).limit(perPage);

    feedbacks = feedbacks.map((x) => {
      return {
        _id: x._id,
        // userId: req.user._id,
        userName: x.userName,
        content: x.content,
        numOfStars: x.numOfStars,
        createdAt: x.createdAt,
        reply: x.reply,
      };
    });
    // const io = MySocket.prototype.getInstance();
    // io.emit("GetAllFeedback");
    res.status(200).json({
      status: 200,
      msg: "Get all feedbacks successfully!",
      feedbacks,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/feedbacks/reply/:feedbackId Get feedback by id
 * @apiName Get feedback by id
 * @apiGroup Feedback
 * @apiParam {String} feedbackId Feddback's id
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get feedback successfully!</code> if everything went fine.
 * @apiSussess {object} feedback
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *       {
 *           "status": 200,
 *           "msg": "Get list reply successfully!",
 *           "feeback": {
 *               "_id": "6086337c692e3429b8b8a37a",
 *               "shoeId": "6076c317ebb733360805137a",
 *               "userId": "607b99348f2d3500151f091d",
 *               "userName": "Nguyen Van B",
 *               "content": "Đồ ăn rất ngon",
 *               "numOfStars": 4,
 *               "createAt": "2021-04-26T03:29:00.439Z",
 *               "updateAt": "2021-04-26T03:29:00.439Z",
 *               "reply": [
 *                   {
 *                       "_id": "60863bd9168d1d075cc6226c",
 *                       "userName": "Nguyen Van B",
 *                       "content": "Đồ ăn rất ngon. Đã mua lần 2",
 *                       "createAt": "2021-04-26T04:04:41.143Z"
 *                   }
 *               ],
 *               "__v": 0
 *         }
 *       }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getFeedbackById = async (req, res, next) => {
  try {
    const feedbackId = req.params.feedbackId;
    const feeback = await Feedback.findById(feedbackId);
    // const io = MySocket.prototype.getInstance();
    // io.emit("GetFeedbackById");
    res.status(200).json({
      status: 200,
      msg: "Get list reply successfully!",
      feeback,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const feedbackController = {
  addFeedback,
  reply,
  getAllFeedbacks,
  getFeedbackById,
};

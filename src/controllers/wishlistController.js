import Mongoose from "mongoose";
import { Shoe, Wishlist } from "../models";
/**
 * @api {get} /api/v1/wishlist Get wishlist of customer
 * @apiName Get wishlist of customer
 * @apiGroup Wishlist
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get wishlist successfully!</code> if everything went fine.
 * @apiSuccess {ObjectId} _id The Id of wishlist
 * @apiSuccess {Array} wishlist the Array shoes of wishlist
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       "msg": "Get wishlist successfully!",
 *       "_id": "6088d77c2b587d62dbc1237b",
 *       "wishlist": [
 *           {
 *               "_id": "6076c317ebb733360805137a",
 *               "typeId": 2,
 *               "name": "Orange juice",
 *               "unitPrice": 40000,
 *               "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618395927/syp4cyw7tjzxddyr8xxd.png",
 *               "createAt": "2021-04-14T10:25:27.376Z",
 *               "numOfStars": 4,
 *               "numOfFeedbacks": 2,
 *               "confirmed": true,
 *               "__v": 0,
 *               "discountOff": 20
 *           },
 *           {
 *               "_id": "607d8172e141e742289e2ecd",
 *               "typeId": 1,
 *               "name": "Đùi gà",
 *               "unitPrice": 60000,
 *               "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618837875/yddc5hcfzu0i5iqimvbf.jpg",
 *               "createAt": "2021-04-19T13:11:14.894Z",
 *               "confirmed": true,
 *               "__v": 0
 *           }
 *       ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const skip = (page - 1) * perPage;
    let total = await Wishlist.aggregate([
      {
        $match: {
          userId: Mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Shoe",
          localField: "shoeIds",
          foreignField: "_id",
          as: "shoes",
        },
      },
    ]);
    total = total[0].shoes.length;
    let wishlist = await Wishlist.aggregate([
      {
        $match: {
          userId: Mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Shoe",
          localField: "shoeIds",
          foreignField: "_id",
          as: "shoes",
        },
      },
    ])
      .skip(skip)
      .limit(perPage);

    const _id = wishlist[0]._id;
    wishlist = wishlist[0].shoes;
    res.status(200).json({
      status: 200,
      msg: "Get wishlist successfully!",
      _id,
      wishlist,
      total,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/wishlist Update wishlist of customer (add or delete item)
 * @apiName Update wishlist of customer (add or delete item)
 * @apiGroup Wishlist
 * @apiParam {String} shoeId The id of shoe
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Update wishlist successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       "msg": "Update wishlist successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const updateWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { shoeId } = req.body;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      await Wishlist.create({ userId });
    }
    const item = await Wishlist.findOne({ userId, shoeIds: shoeId });
    if (item) {
      await Wishlist.findOneAndUpdate(
        { userId },
        {
          $pull: { shoeIds: shoeId },
        }
      );
      await Shoe.findByIdAndUpdate(
        shoeId,
        { isWishlist: false },
        { upsert: true }
      );
    } else {
      await Wishlist.findOneAndUpdate(
        { userId },
        { $push: { shoeIds: shoeId } }
      );
      await Shoe.findByIdAndUpdate(
        shoeId,
        { isWishlist: true },
        { upsert: true }
      );
    }

    res.status(200).json({
      status: 200,
      msg: "Update wishlist successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {delete} /api/v1/wishlist/:shoeId Delete an item of wishlist
 * @apiName Delete an item of wishlist
 * @apiGroup Wishlist
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Delete an item of wishlist successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       "msg": "Delete an item of wishlist successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const deleteItemFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const shoeId = req.params.shoeId;
    await Wishlist.findOneAndUpdate(
      { userId },
      {
        $pull: {
          shoeIds: shoeId,
        },
      }
    );
    await Shoe.findByIdAndUpdate(
      shoeId,
      { isWishlist: false },
      { upsert: true }
    );
    res.status(200).json({
      status: 200,
      msg: "Delete item from wishlist successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const wishlistController = {
  getWishlist,
  updateWishlist,
  deleteItemFromWishlist,
};

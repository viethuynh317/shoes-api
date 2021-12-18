import { Feedback, Shoe } from "../models";
import { isNil, get } from "lodash";
import slugify from "slugify";
import { uploadSingle } from "../configs";
const getAllShoeList = async (req, res, next) => {
  try {
    const shoeList = await Shoe.find({ isConfirmed: true });
    res.status(200).json({
      status: 200,
      msg: "Get shoe list successfully!",
      shoeList,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createNewShoe = async (req, res, next) => {
  try {
    const {
      typeId,
      brand,
      name,
      gender,
      colorway,
      unitPrice,
      discountOff,
      description,
      discountMaximum,
      imageUrl,
      isConfirmed,
    } = req.body;
    const imagePath = get(req, "files[0].path");

    const image = imagePath
      ? await uploadSingle(get(req, "files[0].path"))
      : {};
    const newShoe = await Shoe.create({
      typeId,
      brand,
      name,
      gender,
      colorway,
      unitPrice: unitPrice || 0,
      imageUrl: image.url || "image",
      discountOff: discountOff || 0,
      description,
      discountMaximum: discountMaximum || 0,
      isConfirmed: isConfirmed || false,
      slug: slugify(name),
    });
    // const io = MySocket.prototype.getInstance();
    // await io.emit("ListProduct", "Get list products");
    res.status(201).json({
      status: 201,
      msg: "Create new shoe successfully!",
      newShoe,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getShoeList = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      gender,
      typeId,
      numOfStars,
      discountOff,
      unitPrice,
      isConfirmed,
    } = req.query;

    const findQuery = {
      $and: [{}],
    };

    const sortQuery = {};

    //Find query
    if (search !== "" && !isNil(search)) {
      const searchQuery = { $or: [] };

      searchQuery.$or.push({
        slug: { $regex: slugify(search), $options: "i" },
      });
      findQuery.$and.push(searchQuery);
    }
    if (!isNil(brand)) {
      findQuery.$and.push({ brand });
    }
    if (!isNil(gender)) {
      findQuery.$and.push({ gender });
    }
    if (!isNil(typeId)) {
      findQuery.$and.push({ typeId });
    }
    if (+isConfirmed !== 0 && !isNil(isConfirmed)) {
      findQuery.$and.push({ isConfirmed });
    }

    //Sort query
    if (!isNil(numOfStars)) sortQuery.numOfStars = numOfStars;
    if (+unitPrice !== 0 && !isNil(unitPrice)) sortQuery.unitPrice = unitPrice;
    if (!isNil(discountOff)) sortQuery.discountOff = discountOff;

    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const start = (page - 1) * perPage;
    const shoeAllList = await Shoe.find(findQuery);
    const shoes = await Shoe.find(findQuery)
      .skip(start)
      .limit(perPage)
      .sort(sortQuery);
    res.status(200).json({
      status: 200,
      msg: "Get shoes successfully!",
      data: {
        total: shoeAllList.length,
        result: shoes,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getShoeById = async (req, res, next) => {
  try {
    const shoeId = req.params.id;
    const result = await Promise.all([
      Shoe.findById(shoeId),
      Feedback.find({ shoeId: shoeId }).sort({ _id: "desc" }),
      // Feedback.find({ shoeId: shoeId }).sort({ _id: "desc" }).limit(1),
    ]);
    const shoe = result[0];
    const feedbacks = result[1];
    res.status(200).json({
      status: 200,
      msg: "Get shoe successfully!",
      data: {
        shoe,
        feedbacks,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateShoeById = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      colorway,
      gender,
      unitPrice,
      typeId,
      discountOff,
      description,
      discountMaximum,
      imageUrl,
      isConfirmed,
    } = req.body;
    const shoeId = req.params.id;
    const imagePath = get(req, "files[0].path");

    const image = imagePath
      ? await uploadSingle(get(req, "files[0].path"))
      : {};

    const existedShoe = await Shoe.findById(shoeId);
    if (!existedShoe) {
      throw createHttpError(404, "Shoe id not exist!");
    }

    const data = {};

    if (!isNil(name)) data.name = name;
    if (!isNil(brand)) data.brand = brand;
    if (!isNil(colorway)) data.colorway = colorway;
    if (!isNil(gender)) data.gender = gender;
    if (!isNil(unitPrice)) data.unitPrice = unitPrice;
    if (!isNil(typeId)) data.typeId = typeId;
    if (!isNil(discountOff)) data.discountOff = discountOff;
    if (!isNil(discountMaximum)) data.discountMaximum = discountMaximum;
    if (!isNil(image.url) || !isNil(imageUrl))
      data.imageUrl = image.url || imageUrl;
    if (!isNil(description)) data.description = description;
    if (!isNil(isConfirmed)) data.isConfirmed = isConfirmed;

    const newShoe = await Shoe.findByIdAndUpdate(shoeId, data);
    res.status(200).json({
      status: 200,
      msg: "Update shoe successfully!",
      shoe: newShoe,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteShoeById = async (req, res, next) => {
  try {
    const shoeId = req.params.id;
    const existedShoe = await Shoe.findById(shoeId);
    if (!existedShoe) {
      throw createHttpError(404, "Shoe is not found");
    }
    await Shoe.findByIdAndRemove(shoeId);
    res.status(200).json({
      status: 200,
      msg: "Delete shoe successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const confirmShoe = async (req, res, next) => {
  try {
    const shoeId = req.params.id;
    const shoe = await Shoe.findByIdAndUpdate(shoeId, {
      isConfirmed: true,
    });
    if (!shoe) throw createHttpError(400, "Not found shoe!");
    res.status(200).json({
      status: 200,
      msg: "Confirm shoe successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const shoeController = {
  getShoeList,
  createNewShoe,
  getShoeById,
  updateShoeById,
  deleteShoeById,
  confirmShoe,
};

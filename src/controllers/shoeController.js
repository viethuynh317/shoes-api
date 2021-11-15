import { Shoe } from '../models'

const getShoeList = async (req, res, next) => {
  try {
    const shoeList = await Shoe.find({ confirmed: false });
    res.status(200).json({
      status: 200,
      msg: 'Get shoe list successfully!',
      shoeList
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

const createNewShoe = async (req, res, next) => {
  try {
    const {
      typeId,
      name,
      unitPrice,
      imageUrl,
      discountOff,
      description,
      discountMaximum,
    } = req.body;
    const newFood = await Shoe.create({
      typeId,
      name,
      unitPrice,
      imageUrl,
      discountOff,
      description,
      discountMaximum,
    });
    res.status(201).json({
      status: 201,
      msg: 'Create new shoe successfully!',
      newFood
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export const shoeController = {
  getShoeList,
  createNewShoe
};
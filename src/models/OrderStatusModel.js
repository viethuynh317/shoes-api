import { Schema, model } from "mongoose";
const orderStatusSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
export const OrderStatus = model(
  "OrderStatus",
  orderStatusSchema,
  "OrderStatus"
);

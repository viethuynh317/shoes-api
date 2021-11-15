import { string } from "joi";
import { Schema, model } from "mongoose";
const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  employeesId: {
    type: Schema.Types.ObjectId,
  },
  address: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  statusId: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  shipmentFee: {
    type: Number,
    required: true,
  },
  merchandiseSubtotal: {
    type: Number,
    required: true,
  },
});
export const Order = model("Order", orderSchema, "Order");

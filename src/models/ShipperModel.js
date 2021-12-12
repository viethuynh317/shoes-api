import { Schema, model } from "mongoose";
const shipperSchema = Schema({
  userDetailId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isIdle: {
    type: Number,
    required: true,
    default: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
  },
});
export const Shipper = model("Shipper", shipperSchema, "Shipper");

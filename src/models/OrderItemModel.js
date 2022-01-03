import { Schema, model } from "mongoose";
const orderItemSchema = Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  shoeId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
export const OrderItem = model("OrderItem", orderItemSchema, "OrderItem");

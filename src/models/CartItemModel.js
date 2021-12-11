import { Schema, model } from "mongoose";
const cartItemSchema = new Schema({
  customerId: {
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
export const CartItem = model("CartItem", cartItemSchema, "CartItem");

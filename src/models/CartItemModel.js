import { string } from "joi";
import { Schema, model } from "mongoose";
const cartItemSchema = new Schema({
  customerId: {
    type: String,
    required: true,
  },
  shoeId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
export const CartItem = model("CartItem", cartItemSchema, "CartItem");

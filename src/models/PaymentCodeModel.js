import { Schema, model } from "mongoose";
const codeSchema = Schema({
  code: {
    type: String,
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  updateAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expired: {
    type: Boolean,
    required: true,
    default: false,
  },
});
export const PaymentCode = model("PaymentCode", codeSchema, "PaymentCode");

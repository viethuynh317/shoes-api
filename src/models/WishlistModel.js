import { Schema, model } from "mongoose";
const wishlistSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  shoeIds: [{ type: Schema.Types.ObjectId }],
});
export const Wishlist = model("Wishlist", wishlistSchema, "Wishlist");

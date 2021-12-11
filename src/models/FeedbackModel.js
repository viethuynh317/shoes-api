import { Schema, model } from "mongoose";
const replySchema = Schema({
  userName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const feedbackSchema = Schema({
  shoeId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  numOfStars: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  reply: [
    {
      type: replySchema,
    },
  ],
});
export const Feedback = model("Feedback", feedbackSchema, "Feedback");
export const Reply = model("Reply", replySchema);

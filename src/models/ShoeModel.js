import { Schema, model } from 'mongoose';

const shoeSchema = Schema({
  typeId: {
    type: Number,
    ref: 'ShoeType'
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  discountOff: {
    type: Number,
  },
  description: {
    type: String
  },
  discountMaximum: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  numOfStars: {
    type: Number
  },
  numOfFeedbacks: {
    type: Number
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  }
});

shoeSchema.index({ name: 'text'});
export const Shoe = model('Shoe', shoeSchema, 'Shoe')
import { Schema, model } from 'mongoose';

const shoeTypeSchema = Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

export const ShoeType = model('ShoeType', shoeTypeSchema, 'ShoeType');
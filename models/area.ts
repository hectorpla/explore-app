import mongoose from 'mongoose';
import { IArea, IBusiness } from '../types';

export interface IAreaModel extends mongoose.Document, IArea {
}

// a simplified version of business type
const BusinessSchema = new mongoose.Schema({
  name: String,
  alias: String,
  url: String,
  rating: Number,
  categories: [String],
  photos: String,
} as {[key in keyof IBusiness]: any});

const PlaceOfInterestSummarySchema = new mongoose.Schema({
  category: String,
  total: Number,
  tops: [BusinessSchema]
});

const AreaSchema = new mongoose.Schema({
  term: {
    type: String,
    unique: true
  },
  place_of_interest_summaries: [PlaceOfInterestSummarySchema]
});

export const AreaModel = mongoose.model('Area', AreaSchema);

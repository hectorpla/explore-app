import mongoose from "mongoose";
import { IArea, IBusiness, IPlaceOfInterestSummary } from "../types";

/**
 * pattern: as {[key in keyof <Interface>]: any}, a link to type defintion
 * boilerplate to sync keys between defintions of types and db models
 * issues:
 * 1. `shallow` check
 * 2. shadow the type of SchemaDefinition as the first
 */

export interface IAreaModel extends mongoose.Document, IArea {}

// a simplified version of business type
const BusinessSchema = new mongoose.Schema({
  name: String,
  alias: String,
  url: String,
  rating: Number,
  categories: [String],
  photos: [String]
} as { [key in keyof IBusiness]: any });

const PlaceOfInterestSummarySchema = new mongoose.Schema({
  category: String,
  total: Number,
  tops: [BusinessSchema]
} as { [key in keyof IPlaceOfInterestSummary]: any });

const AreaSchema = new mongoose.Schema({
  term: {
    type: String,
    unique: true,
    lowercase: true
  },
  place_of_interest_summaries: [PlaceOfInterestSummarySchema]
} as { [key in keyof IArea]: any });

/**
 * refers to https://brianflove.com/2016/10/04/typescript-declaring-mongoose-schema-model/
 * the generic bind the document to json
 */
export const AreaModel = mongoose.model<IAreaModel>("Area", AreaSchema);

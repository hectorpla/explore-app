import mongoose from "mongoose";
import { IHitList } from "../types";

export interface IHitListModel extends mongoose.Document, IHitList {}

// TODO: set index for the name
const HitListSchema = new mongoose.Schema({
  name: String,
  lastModified: Date,
  list: [String]
});

// TODO not sure if the `update` describe intention correctly: every time we save or modify
// HitListSchema.pre('update', function(next) {
//   const thisItem = this;
//   thisItem
// })

export const HitListModel = mongoose.model<IHitListModel>(
  "HitList",
  HitListSchema
);

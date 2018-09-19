import mongoose from 'mongoose';
import { ICountryCategory } from '../types';

export interface ICountryCategoryModel extends mongoose.Document, ICountryCategory {
}

const CategorySchema = new mongoose.Schema({
  title: String,
  alias: String,
  parent_categories: [{
    title: String,
    alias: String
  }]
});

const CountryCategorySchema: mongoose.Schema = new mongoose.Schema({
  country: {
    type: String,
    unique: true
  },
  updated_date: Date,
  categories: [CategorySchema]
});

CountryCategorySchema.pre('save', function (next) {
  const thisDoc = this as ICountryCategoryModel;
  if (!thisDoc.updated_date) {
    thisDoc.updated_date = new Date();
  }
  next();
});

export const CountryCategoryModel = mongoose.model('Country', CountryCategorySchema);

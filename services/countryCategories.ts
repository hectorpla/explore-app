import fetch from 'node-fetch';
import gql from 'graphql-tag';

import { CountryCategoryModel, ICountryCategoryModel } from '../models';
import { ICountryCategory } from '../types';
import { YELP_GRAPHQL_URL, graphqlHeaderFactory } from '../common';

const categoryQueryFactory = (queryCountry: string) => gql`{
  categories(country: "${queryCountry}") {
    total
    category {
      title
      alias
      parent_categories {
        title
        alias
      }
    }
  }
}`;

export const storeCategories = (queryCountry: string) => fetch(YELP_GRAPHQL_URL, {
  method: 'POST',
  headers: graphqlHeaderFactory(),
  body: categoryQueryFactory(queryCountry),
}).then(res => res.json())
  .then(result => {
    console.log(result);
    const { total, category } = result.data.categories;
    console.log(category);
    new CountryCategoryModel({
      country: queryCountry,
      categories: category, // !no static type check here
      total
    } as ICountryCategory)
      .save().catch(err => console.log(err));
  });

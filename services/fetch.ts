import fetch from 'node-fetch';
import { CountryCategoryModel, ICountryCategoryModel } from '../models';

import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { ICountryCategory } from '../types';


// const CategoryType = new GraphQLList

// const CategorieListType = new GraphQLObjectType({
//   name: 'categories',
//   fields: {
//     total: {
//       type: GraphQLString
//     },
//     category: {
//       type: new GraphQLList
//     }
//   }
// });


// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//       categories: {
//         type: CategorieListType
//       }
//     }
//   })
// });



const categoryQueryFactory = (queryCountry: string) => `{
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

export const storeCategories = (queryCountry: string) => fetch('https://api.yelp.com/v3/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/graphql'
  },
  body: categoryQueryFactory(queryCountry),
  // useNewUrlParser: true
}).then(res => res.json())
  .then(result => {
    console.log(result);
    const { total, category } = result.data.categories;
    console.log(category);
    new CountryCategoryModel({
      country: queryCountry,
      categories: category,
      total
    } as ICountryCategory)
      .save(err => {
        if (err) console.error(err);
      });
  });

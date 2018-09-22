import { storeCategories } from "./countryCategories";
import setup = require('../common/setup');
import { storeAreaSummaries } from "./areaSummary";
import { graphqlHeaderFactory } from "../common";

const queryCountry = 'Japan';

setup.then(() => {
  // storeCategories(queryCountry)
  storeAreaSummaries('tokyo');
})
  .then(() => console.log('test finished'))
  .catch(() => {
    process.exit();
  });

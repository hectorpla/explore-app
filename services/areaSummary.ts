import fetch from 'node-fetch';
import * as _ from 'lodash';

import { IArea, IBusiness, IPlaceOfInterestSummary } from '../types';
import { AreaModel } from '../models';
import { YELP_GRAPHQL_URL, graphqlHeaderFactory } from '../common';
import { PLACE_INTEREST } from '../constants';

const areaQueryFactory = (area: string, category: string) => `query {
  search(location: "${area}", term:"${category}") {
    total
    business {
      name
      alias
      url
      rating
      categories {
        title
        parent_categories {
          title
        }
      }
    }
  }
}`;

interface ISearchResult {
  total: number;
  business: IBusiness[];
}

// TODO type the result
const getAreaInfo = (area: string) => (category: string) =>
  fetch(YELP_GRAPHQL_URL, {
    method: 'POST',
    headers: graphqlHeaderFactory(),
    body: areaQueryFactory(area, category)
  }).then(res => res.json());

/**
 * 
 * @param category 
 * @param searchResult 
 */
const getSummaryOfCategory = (
  category: string,
  searchResult: ISearchResult
): IPlaceOfInterestSummary => {
  const { total, business } = searchResult;
  return {
    category,
    total,
    tops: business.slice(0, 5).map(b => ({
      ...b,
      categories: b.categories.map(c => c.title),
      parent_categories: _.flattenDeep(b.categories.map(
        c => c.parent_categories.map(pc => pc.title)
      ))
    }))
  }
}

export const storeAreaSummaries = (area: string) => {
  const getFactory = getAreaInfo(area);

  const areaDoc = {
    term: area,
    feature_places: [],
    place_of_interest_summaries: []
  } as IArea;

  // concurrent
  const promises = PLACE_INTEREST.map((category, index) =>
    getFactory(category)
      .then(result => {
        try {
          areaDoc.place_of_interest_summaries.push(
            getSummaryOfCategory(PLACE_INTEREST[index], result.data.search));
        } catch (err) {
          console.log(err);
        }
      }));
  return Promise.all(promises).then(() => {
    console.log('retrievied and computed', JSON.stringify(areaDoc));
    // new AreaModel(areaDoc).save().catch(err => console.log(err));
    AreaModel.findOneAndUpdate({ term: 'area' }, areaDoc, { upsert: true })
      .catch(err => console.log(err));
  });
}

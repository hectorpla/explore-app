import fetch from 'node-fetch';
import * as _ from 'lodash';
import gql from 'graphql-tag';
import logger from '../common/logger';

import { IArea, IBusiness, IPlaceOfInterestSummary } from '../types';
import { AreaModel } from '../models';
import { YELP_GRAPHQL_URL, graphqlHeaderFactory, prettyPrintJson } from '../common';
import { PLACE_INTEREST } from '../constants';
import { deduplicate } from './utils';
import { NonNullableGraphQLError } from './utils/errors';

const areaQueryFactory = (area: string, category: string) => `query {
  search(location: "${area}", term:"${category}") {
    total
    business {
      name
      alias
      url
      rating
      photos
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

/**
 * fetch info from Yelp API and summarize the area infomation
 * currently only consider places of interest
 * @param area name of the term, ex.: tokyo
 */
export const storeAreaSummaries = (area: string): Promise<IArea> => {
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
        if (result.errors) {
          logger.error({
            query: areaQueryFactory(area, category),
            errors: result.errors
          });
          throw Error('GraphQL client error');
        }
        areaDoc.place_of_interest_summaries.push(
          getSummaryOfCategory(
            PLACE_INTEREST[index],
            result.data.search
          )
        );
      }));
  return Promise.all(promises).then(() => {
    logger.debug(`retrievied and computed: ${JSON.stringify(areaDoc)}`);
    return AreaModel.findOneAndUpdate(
      { term: area }, // TODO test modification
      areaDoc,
      { upsert: true }
    ).catch(err => { throw err; }); // overloads: should return promise
  }).then(() => areaDoc);
}

/**
 * flow 1. search in Mongodb, if not found, 2. make query to Yelp
 * @param area term to search
 */
export const getAreaSummaries = (area: string): Promise<IArea> => {
  return AreaModel.findOne({
    term: area
  } as IArea).exec() // !findOne().then() is not a full-fludged promise
    .then(res => {
      logger.debug(`findOne: ${res}`);
      if (!res) {
        // make request to Yelp GraphQL APIs
        logger.info(`peform search query from Yelp: ${area}`);
        return storeAreaSummaries(area);
      }
      return res;
    })
    .catch(err => {
      logger.debug(err);
      throw err;
    });
}

/**
 * get all top level area in the db
 */
export const getAllAreas = (): Promise<string[]> =>
  AreaModel.find({}).exec()
    .then(res => res.map(area => area.term));

/**
 * get photos urls from top places in every categories of places
 * @param area 
 */
export const getAllPhotos = (area: string): Promise<string[]> => {
  return AreaModel.findOne({ term: area }).exec()
    .then(areaSummary => {
      if (!areaSummary) {
        throw Error('area not found');
      }
      const places = _.flatten(areaSummary.place_of_interest_summaries
        .map(summary => summary.tops));
      try {
        return _.flatten(
          deduplicate(places, summary => summary.name)
            .map(place => {
              if (place.photos === undefined) {
                throw new NonNullableGraphQLError(
                  "Area { place_of_interest_summaries { tops { photos } } }");
              }
              return place.photos;
            })
        );
      } catch (err) {
        if (!(err instanceof NonNullableGraphQLError)) { throw err; }
        // TODO unsure, test
        return storeAreaSummaries(area).then(() => getAllPhotos(area));
      }
    });
}

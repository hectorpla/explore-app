import fetch from 'node-fetch';
import * as _ from 'lodash';
import gql from 'graphql-tag';

import { YELP_GRAPHQL_URL, graphqlHeaderFactory, inspectObject } from '../common';
import { YELP_business } from '../graphql/yelp/__generated__/YELP';
import logger from '../common/logger';

const businessQueryFactory = (id: string) => `query {
  business(id: "${id}") {
    name
    id
    alias
    is_claimed
    is_closed
    url
    phone
    display_phone
    review_count
    categories {
      title
      alias
      parent_categories {
        title
        alias
      }
    }
    rating
    price
    location {
      address1
      address2
      address3
      city
      state
      postal_code
      country
      formatted_address
    }
    coordinates {
      latitude
      longitude
    }
    photos
    reviews {
      id
      rating
      user {
        id
        image_url
        profile_url
        name
      }
      text
      time_created
      url
    }
    distance
  }
}`;

export const getBusinessInfo = (id: string): Promise<YELP_business> => fetch(YELP_GRAPHQL_URL, {
  method: 'POST',
  headers: graphqlHeaderFactory(),
  body: businessQueryFactory(id)
}).then(res => res.json())
  .then(res => {
    logger.debug(inspectObject(res));
    if (res.error) { throw res.error; }
    return res.data.business;
  });

// getBusinessInfo("皇居東御苑-千代田区-2")
//   .then(res => deepLog(res))
//   .catch(res => deepLog(res.erros))

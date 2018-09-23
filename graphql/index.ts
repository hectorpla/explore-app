import { importSchema } from 'graphql-import';
import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { prettyPrintJson } from '../common';
import { IArea } from '../types';
import { getAreaSummaries } from '../services/areaSummary';
import logger from '../common/logger';

const printArgsInResolvers = (obj: any, args?: any, context?: any, info?: any) => {
  logger.debug(` in Area { term }
--- prev obj
${prettyPrintJson(obj)}
--- args
${prettyPrintJson(args)}
--- context
${prettyPrintJson(context)}
--- info
${prettyPrintJson(info)}`);
}

// runtime: should use static directory
const typeDefs = gql(importSchema(`${__dirname}/area.graphql`));

const mockAreaSummary = {
  term: 'somewhere',
  feature_places: ['buil', 'beer'],
  place_of_interest_summaries: [{
    category: 'garden',
    total: 12,
    tops: [{
      name: 'bilil'
    }, {
      name: 'wook'
    }]
  }]
}

interface areaSummaryObject {
  term: string;
}

const resolvers = {
  Query: {
    areaSummary(obj: any, args: {}) {
      const {term} = args as areaSummaryObject;
      logger.log('debug', `searching areaSummary, area ${term}`);
      // TODO: flow 1. search in Mongodb, if not found, 2. make query to Yelp
      return getAreaSummaries(term);
    }
  },
  Area: {
    term(obj: any, args: any, context: any, info: any) {
      // printArgsInResolvers(obj);
      return obj.term;
    },
    feature_places(area: IArea) {
      return area.feature_places;
    },
    place_of_interest_summaries(area: IArea) {
      return area.place_of_interest_summaries;
    }
  }
}

export const areaSchemaConfig = { typeDefs, resolvers };

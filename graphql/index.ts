import { importSchema } from 'graphql-import';
import { gql } from 'apollo-server-express';
import { prettyPrintJson } from '../common';
import { IArea } from '../types';
import { getAreaSummaries, getAllAreas, getAllPhotos } from '../services/areaSummary';
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

interface simpleSearchArgsObject {
  term: string;
}

const resolvers = {
  Query: {
    areaSummary(obj: any, args: {}) {
      const { term } = args as simpleSearchArgsObject;
      logger.debug(`searching areaSummary, area ${term}`);
      return getAreaSummaries(term);
    },
    topAreas() {
      return getAllAreas();
    },
    // TODO add photos summaries
    photos(obj: any, args: {}) {
      const { term } = args as simpleSearchArgsObject;
      return getAllPhotos(term);
    }
  },
  Area: {
    // a resolover takes the following arguments 
    term(obj: IArea, args: any, context: any, info: any) {
      // printArgsInResolvers(obj);
      return obj.term;
    },
    feature_places(area: IArea) {
      return area.feature_places;
    },
    place_of_interest_summaries(area: IArea) {
      return area.place_of_interest_summaries;
    }
  },

}

export const areaSchemaConfig = { typeDefs, resolvers };

import { importSchema } from 'graphql-import';
import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { prettyPrintJson } from '../common';

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

const resolvers = {
  Query: {
    areaSummary(term: string) {
      return mockAreaSummary
    }
  },
  Area: {
    term(obj: any, args: any, context: any, info: any) {
      console.log(` in Area { term }
--- prev obj
${prettyPrintJson(obj)}
--- args
${prettyPrintJson(args)}
--- context
${prettyPrintJson(context)}
--- info
${prettyPrintJson(info)}`);
      return mockAreaSummary.term;
    },
    feature_places() {
      return mockAreaSummary.feature_places;
    },
    place_of_interest_summaries() {
      return mockAreaSummary.place_of_interest_summaries;
    }
  },

}

// console.log(typeDefs);
export const areaSchemaConfig = { typeDefs, resolvers };

import { inspect } from 'util';

export const YELP_GRAPHQL_URL = 'https://api.yelp.com/v3/graphql';

/**
 * generate Bearer header as a json
 * @param apiKey yelp application key
 */
export const graphqlHeaderFactory = (apiKey?: string) => ({
  Authorization: `Bearer ${apiKey || process.env.API_KEY}`,
  'Content-Type': 'application/graphql'
});

export const prettyPrintJson = (obj: Object) => JSON.stringify(obj, null, 2);

export const deepLog = (obj: any, depth: number | null = null) => {
  console.log(inspect(obj, false, depth, true));
}

export const inspectObject = (obj: any) => inspect(obj, false, null, true);

export * from './setup';

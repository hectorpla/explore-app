/**
 * definition all refering to yelp graphql apis
 */

export interface IRawCategory {
  title: string;
  alias: string;
}

export interface ICategory extends IRawCategory {
  parent_categories: IRawCategory[];
}

export interface ILocation {
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  formatted_address: string;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IBusiness {
  name: string;
  yelp_alias: string; // unique
  yelp_url: string;
  location: ILocation;
  coordinates: ICoordinates;
  photos: string[];

  // TODO tentative field following:
  // hours

  // distance: number; // only in dynamic search
}

// TODO add event
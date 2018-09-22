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
  categories: ICategory[];
  alias: string; // unique
  url?: string;
  location?: ILocation;
  coordinates?: ICoordinates;
  photos?: string[];
  reviews?: string[];

  // TODO tentative field following:
  // hours
  // distance: number; // only in dynamic search
}


/**
 * derived data structure from yelp
 */
export interface IGeometry {
  type: string;
  center?: ICoordinates;
  radius: number;
  frame?: ICoordinates[];
}

export interface IPlaceOfInterestSummary {
  category: string;
  total: number;
  tops: {
    name: string;
  }[]; // records of the top 5? elements
}

// TODO use libray like typeGraphql to make it sync with the mongodb mdoel
export interface IArea {
  term: string; // roughly refer to term in search
  geometry?: IGeometry;
  parent_area?: string[];

  // area summaries
  feature_places: string[]; // tentative type: yelp_alias
  place_of_interest_summaries: IPlaceOfInterestSummary[];
}

// TODO add event

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

export interface IYelpBusiness {
  name: string;
  categories: ICategory[];
  alias: string; // unique
  url?: string;
  location?: ILocation;
  coordinates?: ICoordinates;
  photos: string[];
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

// ! copy from IYelpBusiness, only changing the type of categories
export interface IBusiness {
  name: string;
  categories: string[]; // 
  alias: string; // unique
  url?: string;
  location?: ILocation;
  coordinates?: ICoordinates;
  photos: string[];
  reviews?: string[];
}

export interface IPlaceOfInterestSummary {
  category: string;
  total: number;
  tops: IBusiness[]; // records of the top 5? elements
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

// ! weird, the following snippet compile!!!
const area = {
  term: '',
  // feature_places: [],
  // place_of_interest_summaries: []
} as { [key in keyof IArea]: any }

// should sync with the graphql schema
export interface IPhoto {
  url: string;
  place_name: string;
  place_id: string;
}

// TODO add event

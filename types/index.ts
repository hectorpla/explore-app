export interface IRawCategory {
  title: string;
  alias: string;
}

export interface ICategory extends IRawCategory {
  parent_categories: IRawCategory[];
}

export interface ICountryCategory {
  country: string;
  total?: number;
  categories: ICategory[];
  updated_date?: Date;
}

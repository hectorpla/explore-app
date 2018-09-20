import { ICategory } from './data';

export interface ICountryCategory {
  country: string;
  total?: number;
  categories: ICategory[];
  updated_date?: Date;
}

export * from './data';

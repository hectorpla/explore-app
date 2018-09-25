import { AreaModel } from "../models";

/**
 * get all top level area in the db
 */
export const getAllAreas = (): Promise<string[]> =>
  AreaModel.find({}).exec()
    .then(res => res.map(area => area.term));
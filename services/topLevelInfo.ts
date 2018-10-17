import { AreaModel } from "../models";
import { HitListModel } from "../models/hitList";
import { HitListName_Category } from "../constants";
import { IHitList } from "../types";

/**
 * get all top level area in the db
 */
export const getAllAreas = (): Promise<string[]> => {
  return AreaModel.find({})
    .exec()
    .then(res => res.map(area => area.term));
};

/**
 * scan all area summary in the DB and return all categories in the DB
 */
const scanAllCategories = (): Promise<string[]> => {
  const categorySet = new Set();
  return AreaModel.find()
    .exec()
    .then(result => {
      result.forEach(area => {
        area.place_of_interest_summaries.forEach(summary => {
          summary.tops.forEach(place => {
            place.categories.forEach(cat => categorySet.add(cat));
          });
        });
      });
      return Array.from(categorySet);
    });
};

/**
 * check if the category list is inside the hitList table
 */
export const getAllCategories = (): Promise<string[]> => {
  return HitListModel.findOne({ name: HitListName_Category })
    .exec()
    .then(item => {
      // ? Date operation can be used with '-'
      if (!item || new Date() - item.lastModified > 30 * 24 * 1000) {
        // TODO: scan all the records in the areaSummary table
        return scanAllCategories().then(list =>
          new HitListModel({
            name: HitListName_Category,
            lastModified: new Date(),
            list
          } as IHitList)
            .save()
            .then(() => list)
        );
      }
      return item.list;
    });
};

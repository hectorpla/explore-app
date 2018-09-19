import mongoose from 'mongoose';
import { storeCategories } from "./fetch";

const queryCountry = 'Japan';
mongoose.connect(process.env.MONGODB_HOST!)
  .catch(() => {
    console.log('failed to connect mongoDB')
    process.exit(-1)
  }).then(() => {
    console.log('mongodb: connected');
    storeCategories(queryCountry);
  });
// TODO check if country is cached

// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_HOST!);
//     console.log('mongodb: connected');
//   } catch(err) {
//     console.log('failed to connect mongoDB')
//   }
// })();




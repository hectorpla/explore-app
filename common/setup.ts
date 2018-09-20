import mongoose from 'mongoose';

export = mongoose.connect(process.env.MONGODB_HOST!)
  .catch(() => {
    console.log('failed to connect mongoDB')
    process.exit(-1)
  }).then(() => {
    console.log('mongodb: connected');
  });


// ? propsed top-level async flow, didn't work
// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_HOST!);
//     console.log('mongodb: connected');
//   } catch(err) {
//     console.log('failed to connect mongoDB')
//   }
// })();
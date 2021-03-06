import mongoose from 'mongoose';

export const setup = () => {
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  return mongoose.connect(process.env.MONGODB_HOST!,
    {
      useNewUrlParser: true,
    })
    .catch(() => {
      console.log('failed to connect mongoDB')
      process.exit(-1)
    }).then(() => {
      console.log('mongodb: connected');
    });
}


// ? propsed top-level async flow, didn't work
// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_HOST!);
//     console.log('mongodb: connected');
//   } catch(err) {
//     console.log('failed to connect mongoDB')
//   }
// })();

import mongoose from 'mongoose'

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

// if (mongoose.connection.readyState === 0) {
//   mongoose.set('strictQuery', false);
//   mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
//     .then(result => console.log("connected to mongodb!"))
//     .catch(err => console.error(err));
//   console.log(`created new mongoose instance`);
// }
// else {
//   console.log(`use already-generated mongoose instance`);
// }

async function createMongooseInstance() {
  if (cached.conn) {
    console.log(`use already-generated mongoose instance`);
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
      .then(mongoose => {
        console.log(`created new mongoose instance`);
        console.log("connected to mongodb!");
        return mongoose
      })
      .catch(err => console.error(err));

  } else {

  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default createMongooseInstance
/* https://dev.to/raphaelchaula/adding-mongodb-mongoose-to-next-js-apis-3af */
import mongoose from 'mongoose';

const connectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }

  // Use new db connection
  mongoose.set('strictQuery', false);
  await mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DBNAME,
      useNewUrlParser: true
    })
    .catch(err => console.error(err));
  return handler(req, res);
};

export default connectDB;
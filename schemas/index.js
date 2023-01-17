const mongoose = require('mongoose');

const now = () => format(Date.now(), "yyyy-MM-dd hh:mm.ss") + ": ";

const connect = () => {
    if (process.env.NODE_ENV != 'production') {
        mongoose.set('debug', true)
    }

    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DBNAME,
        useNewUrlParser: true,
    }, (err) => {
        if (err) {
            console.error(now() + 'failed to connect to mongodb');
        } else {
            console.log('successfully connected to mongodb');
        }
    })
}
mongoose.connection.on('error', (err) => {
    console.log(now() + 'mongodb connection error', err);
});

mongoose.connection.on('disconnected', () => {
    console.log(now() + 'disconnected to mongodb. retry to connect.');
    connect();
});

module.exports = connect;

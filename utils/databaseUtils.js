const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const MONGO_URL = process.env.MONGO_URI;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then(client => {
      _db = client.db("airbnb");   // set db FIRST
      callback();                  // then call callback
    })
    .catch(err => {
      console.log('Error while connecting to MongoDB:', err);
    });
};

const getDB = () => {
  if (!_db) {
    throw new Error('Mongo not connected');
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;





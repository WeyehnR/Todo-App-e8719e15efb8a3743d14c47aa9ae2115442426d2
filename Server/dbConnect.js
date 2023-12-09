// dbConnect.js
require('dotenv').config();
const { MongoClient } = require('mongodb');


const uri = process.env.MONGODB_URI;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }
      dbConnection = db.db('yourDatabaseName');
      console.log('Successfully connected to MongoDB.');
      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  }
};

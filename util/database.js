const mongodb = require('mongodb');

let _db;  // _ => to signal this will only be used in this file

const MongoClient = mongodb.MongoClient;


const mongoConnect = (callback) => {
   return MongoClient.connect('mongodb+srv://user_1:500miles@cryptodb.1sdjo.mongodb.net/cryptoDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true })
        .then(clientObj => {
            console.log("database is connected!");
            _db = clientObj.db(); // returns the database 
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
}


const getDb = () => {
    try{
        if (_db) {
            //console.log("from DATABASE FILE"+_db)
            return _db
        }
        throw 'No database found'
    }
    catch(err){
        console.log(err)
    }
    

}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;



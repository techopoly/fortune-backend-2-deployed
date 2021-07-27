const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;
//const getCurrentPrice = require('../model/createCoin').getCurrentPrice;

const createIndicator_M = require('./createIndicator_M');


const exit = async (_id) => {
 
    const db = getDb();
    return db.collection('currentIndicator').find({ _id: new mongodb.ObjectID(_id) }).next()
        .then(response => {
            const index = response.intIndex;
            createIndicator_M.removeInterval(index);
            deleteCurrentIndicator(_id);
            const result = {
                indicator: response
            }
            return result

        })
        .catch(err => {
        })
}

const deleteCurrentIndicator = (coin_id) => {
    const db = getDb();
    return db.collection('currentIndicator').deleteOne({
        _id: new mongodb.ObjectID(coin_id)
    })
        .then((result) => {
        })
}

module.exports = {
    exit: exit,
    deleteCurrentIndicator: deleteCurrentIndicator
}
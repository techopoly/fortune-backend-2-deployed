const axios = require('axios');
const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;       


const fetchRsi = async (symbol, indicator, interval, interval_metric) => {
    try {
        const response = await axios.get(`https://api.taapi.io/${indicator}?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hvcG9seTQ0NEBnbWFpbC5jb20iLCJpYXQiOjE2MjQ0ODQxODcsImV4cCI6NzkzMTY4NDE4N30.rbbboPhxSQnO1AcF3KqVIsXXX-P7sO-Q38rCZCeKvqQ&exchange=binance&symbol=${symbol.toUpperCase()}/USDT&interval=${interval+ interval_metric}`);
        console.log(response.data);
        return {
            message: 'successfull',
            valueObj: response.data
        }
    } catch (err) {
        console.log(err.message);
        return {
            message: err.message,
            valueObj: err.message
        }
    }

}


const getCurrentIndicator = async () => {

    const db = getDb();
    return db.collection('currentIndicator').find().toArray()
        .then(response => {
            console.log(response);
            return response
        })
        .catch(err => {
            console.log(err)
        })

}

//----------------------------------------------------------------------------


exports.fetchRsi = fetchRsi;
exports.getCurrentIndicator = getCurrentIndicator;


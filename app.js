const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');


const price = require('./routes/price');
const indicator = require('./routes/indicator');
const getSymbols = require('./util/symbols');
const mongoConnect = require('./util/database').mongoConnect;
const indicator_M = require('./model/indicator_M');
const createIndicator_M = require('./model/createIndicator_M');
const exitIndicator = require('./model/exitIndicator_M');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); //used for x-www-url-encoded <form>
app.use(express.json()) //used for application/json


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

//getSymbols();

app.use(price);
app.use(indicator)
app.use('/', (req, res, next) => {
    res.status(200).json({
        message: 'path not found'
    })
})


const restartCreateIndicator = async (symbol, indicator, interval, interval_metric) => {
    const indicatorObj = new createIndicator_M.Indicator(symbol, indicator, interval, interval_metric);
    try {
        const _id = await indicatorObj.startProcess();
        return _id;

    } catch (err) {
        console.log(err);
    }

}

mongoConnect(async () => {
    app.listen(process.env.PORT || 8050);
    const allIndicators = await indicator_M.getCurrentIndicator();
    if (allIndicators.length > 0) {
        console.log('current indicator exists');
        allIndicators.map(async (eachObj) => {
            console.log(eachObj);
            const { _id, symbol, indicator, interval, interval_metric } = eachObj;
            await exitIndicator.exit(_id); // first remove interval then create new interval for new indicator. 
            await restartCreateIndicator(symbol, indicator, interval, interval_metric);
            console.log('Restarted and exited previous indicator');
        })
    }
    else {
        console.log('no current indicator exists')
    }
});





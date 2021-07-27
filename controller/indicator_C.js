const indicator_M = require('../model/indicator_M');
const createIndicator_M = require('../model/createIndicator_M');
const exitIndicator_M = require('../model/exitIndicator_M');



const createIndicator = async (req, res, next)=>{

    const symbol = req.query.symbol;
    const indicator = req.query.indicator;
    const interval = req.query.interval;
    const interval_metric = req.query.interval_metric
    const indicatorObj = new createIndicator_M.Indicator(symbol, indicator, interval, interval_metric);
    try {}catch(err){}
    const _id = await indicatorObj.startProcess();
    res.status(200).json({
       message: 'Indicator created', 
       indicator : indicator,
       symbol: symbol,
       interval: interval,
       interval_metric : interval_metric,
       _id: _id      
    });
}


const exitIndicator = async (req, res, next)=>{
    const _id = req.query._id;
    const response = await exitIndicator_M.exit(_id);
    res.status(200).json({
        message: 'Indicator deleted', 
        response: response,
        _id: _id      
     }); 
}

const indicatorValue = async (req, res, next)=>{
    const symbol = req.query.symbol;
    const indicator = req.query.indicator;
    const interval = req.query.interval;
    const interval_metric = req.query.interval_metric
    const response = await indicator_M.fetchRsi(symbol, indicator, interval, interval_metric);
    res.status(200).json({
       messsage : response.message,
       indicator : indicator,
       symbol: symbol,
       interval: interval,
       valueObj: response.valueObj       
    });
}

const getCurrentIndicator = async (req, res, next)=>{

    const allIndicators = await indicator_M.getCurrentIndicator();
    res.status(200).json(
          allIndicators //=>array of objects
    );
}

module.exports.createIndicator = createIndicator;
module.exports.indicatorValue = indicatorValue;
exports.exitIndicator = exitIndicator;
exports.getCurrentIndicator = getCurrentIndicator;



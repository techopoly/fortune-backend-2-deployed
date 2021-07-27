const price_M = require('../model/price_M');



const price_C = async (req, res, next)=>{

    const symbol = req.query.symbol;
    const response = await price_M.fetchPrice(symbol);
    res.status(200).json({
        message: response.message,
        symbol: symbol,
        price: response.price
    });
}

module.exports = price_C;
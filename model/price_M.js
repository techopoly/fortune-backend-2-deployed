const axios = require('axios');


const fetchPrice = async (symbol) => {
    try {
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`);
        console.log(response.data);
        return {
            message: 'successfull',
            price: response.data.price
        }
    } catch (err) {
        console.log(err.message);
        return {
            message: err.message,
            price: err.message
        }
    }

}


exports.fetchPrice = fetchPrice;
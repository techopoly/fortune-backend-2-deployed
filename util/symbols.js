const axios = require('axios');



const getSymbols = async()=>{

    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    const symbolsArray = response.data.symbols;
    let justSymbol = [];
    symbolsArray.forEach(element => {
        justSymbol.push(element.baseAsset);
    });

}

module.exports = getSymbols;
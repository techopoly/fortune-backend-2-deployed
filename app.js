const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');


const price = require('./routes/price');
const indicator = require('./routes/indicator');
const getSymbols = require('./util/symbols');
const mongoConnect = require('./util/database').mongoConnect;

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
app.use('/', (req, res, next)=>{
    res.status(200).json({
        message: 'path not found'
    })
} )



const fetchIndicatorValue = () => {
            return axios.get(`https://api.taapi.io/${this.indicator}?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hvcG9seTQ0NEBnbWFpbC5jb20iLCJpYXQiOjE2MjQ0ODQxODcsImV4cCI6NzkzMTY4NDE4N30.rbbboPhxSQnO1AcF3KqVIsXXX-P7sO-Q38rCZCeKvqQ&exchange=binance&symbol=${this.symbol.toUpperCase()}/USDT&interval=${this.interval+ this.interval_metric}`)
                .then((response) => {
                    currentPrice = response.data.price;
                    if (currentPrice < threshold * peak) {
                        console.log("DANGER");
                        p1.send(msg, function (err, result) {
                            if (err) {
                                throw err
                            }
                            console.log(result)
                        });
                        p2.send(msg, function (err, result) {
                            if (err) {
                                throw err
                            }
                            console.log(result)
                        });

                        // clearInterval(this.interval_1);
                        removeInterval(this.intIndex);
                        exitModel.deleteCurrentCoin(this._id);

                    }
                    if (currentPrice > peak) {
                        peak = currentPrice
                        console.log("peak: " + peak);
                    }
                    console.log(this.symbol, "_currentPrice: " + currentPrice);
                    return response
                })
                .catch(
                    (err) => {
                        console.log('ERROR GETTING COIN PRICE');
                        console.log(err)
                        // console.log(err)
                    }
                )
        }





mongoConnect(() => {
    app.listen(process.env.PORT || 8050);
});





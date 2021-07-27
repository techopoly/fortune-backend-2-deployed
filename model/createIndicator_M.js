const axios = require('axios');
const Push = require('pushover-notifications');

const getDb = require('../util/database').getDb;
//const exitModel = require('../model/exitModel');
let intRef = []


const removeInterval = (num) => {
    let message = 'interval reference exists'
    if (intRef[num] == undefined) {
        message = 'interval reference doesnt exist '
    }
    console.log(`interval reference index: ${num} `, message);
    clearInterval(intRef[num])
}



var p1 = new Push({
    user: 'ucvsdabqdqhf89w3y9r1y8vcnsgwx5',
    token: 'as277w258d5osnxptbib3vq489zhv7'
})

var p2 = new Push({
    user: 'ua1s43mfjm7hkco5vim6u58dh9jajs',
    token: 'as277w258d5osnxptbib3vq489zhv7'
})

var msg = {
    message: 'OPPORTUNITY',	// required
    title: "",
    priority: 2,
    retry: 30,
    expire: 3600
}

class Indicator {
    constructor(symbol, indicator, interval, interval_metric) {
        this.symbol = symbol;
        this.indicator = indicator;
        this.interval = interval;
        this.interval_metric = interval_metric;
        this.time = new Date();
        this.intIndex;
        this.flag = 0;
        this.macdFlag = 0;
    }


    save = async () => {
        const db = getDb();
        await db.collection('currentIndicator').insertOne(this)
        // console.log('COULD NOT SAVE INDICATOR VALUE');
        return this._id;
    }


    algoRsi = () => {
        return axios.get(`https://api.taapi.io/${this.indicator}?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hvcG9seTQ0NEBnbWFpbC5jb20iLCJpYXQiOjE2MjQ0ODQxODcsImV4cCI6NzkzMTY4NDE4N30.rbbboPhxSQnO1AcF3KqVIsXXX-P7sO-Q38rCZCeKvqQ&exchange=binance&symbol=${this.symbol.toUpperCase()}/USDT&interval=${this.interval + this.interval_metric}`)
            .then((response) => {
                let value = response.data.value;
                console.log('indicator value: ', [this.indicator], value)
                if (this.flag == 1) {
                    if (value >= 27.98) { // has to be 30                        
                        // p1.send(msg, function (err, result) {
                        //     if (err) {
                        //         throw err
                        //     }
                        //     console.log(result)
                        // })
                        this.flag = 0;
                    }
                } else {
                    if (value < 28) {
                        this.flag = 1;
                    }
                }
                return response.data;
            })
            .catch(
                (err) => {
                    console.log('ERROR setting indicator');
                    console.log(err.response.data)
                }
            )
    }

    algoMacd = () => {

        return axios.get(`https://api.taapi.io/${this.indicator}?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzbWFpbHl1c3VmNDQ3N0BnbWFpbC5jb20iLCJpYXQiOjE2MjcyMjgyMDMsImV4cCI6NzkzNDQyODIwM30.Lz-EC0DNJcRdyIs9EYarhrtncLIihJta5pTNI14v74U&exchange=binance&symbol=${this.symbol.toUpperCase()}/USDT&interval=${this.interval + this.interval_metric}`)
            .then((response) => {
                let value = response.data;
                console.log('indicator value: ', [this.indicator], value);
                if (this.macdFlag == 1) {
                    if (value.valueMACD < value.valueMACDSignal) {
                        console.log(value.valueMACD, value.valueMACDSignal);
                        this.macdFlag = 0;
                    }
                }
                else {
                    if (value.valueMACD > value.valueMACDSignal) {
                        console.log(value.valueMACD, value.valueMACDSignal);
                        this.macdFlag = 1;
                        // p1.send(msg, function (err, result) {
                        //     if (err) {
                        //         throw err
                        //     }
                        //     console.log(result)
                        // })
                    }
                }
            })
        // .catch(
        //     (err) => {
        //         console.log('ERROR setting indicator');
        //         //console.log(err.response.data)
        //     }
        // )
    }

    findAlgo = () => {
        this.algo;
        switch (this.indicator) {
            case 'rsi':
                this.algo = this.algoRsi
                break;

            case 'macd':
                this.algo = this.algoMacd
                break;
            default:
                this.algo = this.algoRsi
        }
    }


    startProcess = async () => {

        // pra: uz2deb865aq3fjsdhamsq4ys6ihang
        // pra2: ua1s43mfjm7hkco5vim6u58dh9jajs
        // ishmam: uhgpth8xaedb8i12xmmf54a3gar79r
        // a: uz6sz8umnmwf2b4e65uy7k8m8yx7gj
        // ishmam_desk: uhgpth8xaedb8i12xmmf54a3gar79r
        //ishmam_2: ucvsdabqdqhf89w3y9r1y8vcnsgwx5



        // p.send(msg, function (err, result) {
        //     if (err) {
        //         throw err
        //     }
        //     console.log(result)
        // })
        this.findAlgo();
        let lenght = intRef.length;  // stores the lenght at the moment when this function(startProcess) was first executed
        this.intIndex = lenght;
        console.log('this.intIndex: ', this.intIndex);
        intRef[this.intIndex] = setInterval(this.algo, 1000 * 16);
        const _id = await this.save();
        return _id;
    }
}



exports.Indicator = Indicator;
exports.removeInterval = removeInterval;



//api endpoint: 
//https://api.taapi.io/rsi?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hvcG9seTQ0NEBnbWFpbC5jb20iLCJpYXQiOjE2MjQ0ODQxODcsImV4cCI6NzkzMTY4NDE4N30.rbbboPhxSQnO1AcF3KqVIsXXX-P7sO-Q38rCZCeKvqQ&exchange=binance&symbol=ETH/USDT&interval=1h
/*

1. create different functions for different indicator since we need to apply distinct
   algorithmn for every indicator
2. we have to use same logic we used for createCoin to handle the intervarl references

//api key-macd : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzbWFpbHl1c3VmNDQ3N0BnbWFpbC5jb20iLCJpYXQiOjE2MjcyMjgyMDMsImV4cCI6NzkzNDQyODIwM30.Lz-EC0DNJcRdyIs9EYarhrtncLIihJta5pTNI14v74U
//api key-rsi : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hvcG9seTQ0NEBnbWFpbC5jb20iLCJpYXQiOjE2MjQ0ODQxODcsImV4cCI6NzkzMTY4NDE4N30.rbbboPhxSQnO1AcF3KqVIsXXX-P7sO-Q38rCZCeKvqQ
*/
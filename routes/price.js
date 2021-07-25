const express = require('express');


const price_C = require('../controller/price_C')


const router = express.Router();



router.get('/price', price_C );










module.exports = router;
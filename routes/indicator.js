const express = require('express');


const indicator_C = require('../controller/indicator_C')


const router = express.Router();



router.get('/indicator/value', indicator_C.indicatorValue );
router.post('/indicator/createIndicator', indicator_C.createIndicator)
router.post('/indicator/exitIndicator', indicator_C.exitIndicator);
router.get('/indicator/getCurrentIndicator', indicator_C.getCurrentIndicator);



module.exports = router;
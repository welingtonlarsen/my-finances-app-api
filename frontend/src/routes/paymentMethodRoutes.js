const express = require('express')
const router = express.Router();
const paymentMethodService = require('../services/paymentMethodService')

router.get('/', paymentMethodService.getPaymentMethods)

module.exports = router
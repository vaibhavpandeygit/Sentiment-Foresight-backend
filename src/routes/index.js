const express = require('express');
const authRouter = require('./auth/auth');
const brandRouter = require('./brand');
const { requireSignIn } = require('../middleware/requireSignIn');
const commonRouter = require('./common');
const consumerRouter = require('./consumer');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/common', requireSignIn(["consumer","brand"]), commonRouter);
router.use('/brand', requireSignIn(["brand"]), brandRouter);
router.use('/consumer', requireSignIn(["consumer"]), consumerRouter);

module.exports = router
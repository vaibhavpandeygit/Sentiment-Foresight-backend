const Express = require('express');
const { searchProducts } = require('../../controller/consumer/searchController');
const { writeReview } = require('../../controller/consumer/reviewController');
const consumerRouter = Express.Router();

consumerRouter.get('/search', searchProducts);
consumerRouter.post('/writereview', writeReview);

module.exports = consumerRouter;
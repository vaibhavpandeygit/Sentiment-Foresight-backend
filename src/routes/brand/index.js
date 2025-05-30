const Express = require('express');
const { addProduct, updateProduct } = require('../../controller/brand/productController');
const brandRouter = Express.Router();

//Product Routes
brandRouter.post('/addproduct', addProduct);
brandRouter.put('/updateproduct/:id', updateProduct);


module.exports = brandRouter;
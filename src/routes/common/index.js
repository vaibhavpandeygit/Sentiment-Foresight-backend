const Express = require('express');
const commonRouter = Express.Router();
const { getMe, updateMe, updatePassword } = require('../../controller/common/commonController');

commonRouter.get('/getme' ,getMe);
commonRouter.put('/updateMe', updateMe);
commonRouter.put('updatepassword', updatePassword)

module.exports = commonRouter;
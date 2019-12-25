const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


const OrdersContoller = require('../controllers/orders_Contoller');


router.get('/', checkAuth, OrdersContoller.orders_get_all);

router.post('/',checkAuth, OrdersContoller.orders_create_order);

router.get('/:orderId',checkAuth, OrdersContoller.orders_get_order);

router.delete('/:orderId',checkAuth, OrdersContoller.orders_delete_order);

module.exports = router;
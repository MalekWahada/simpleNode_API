const express = require('express');
const router = express.Router();

const usersContoller = require('../controllers/users_contoller');
const checkAuth = require('../middleware/check-auth');

// check if user's eamil addr exists first 
router.post('/signup', usersContoller.user_signup);

router.post('/login', usersContoller.user_login);

router.delete('/:userId',checkAuth, usersContoller.user_delete);

module.exports = router;
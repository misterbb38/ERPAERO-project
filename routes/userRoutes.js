const express = require('express');
const router = express.Router();
const verifyRefreshToken = require('../middleware/verifyRefreshToken');
const {
    registerUser,
    loginUser,
    refreshAccessToken,
    getMe,
    logout
} = require('../controllers/userController.js');

const { protect } = require('../middleware/authMiddleware.js');

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.post('/signin/new_token', verifyRefreshToken, refreshAccessToken);


router.get('/info', protect, getMe); 
router.get('/logout', protect, logout); 

module.exports = router;

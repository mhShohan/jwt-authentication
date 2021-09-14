const router = require('express').Router();
const {
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    logout,
} = require('../controllers/authController');

router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/login', getLogin);
router.post('/login', postLogin);

router.get('/logout', logout);

module.exports = router;

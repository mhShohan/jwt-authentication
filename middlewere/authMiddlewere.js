const jwt = require('jsonwebtoken');
const User = require('../model/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check that JST token exist and verify
    if (token) {
        jwt.verify(token, 'Shohan', (err, decodedToken) => {
            if (!err) {
                console.log(decodedToken);
                next();
            } else {
                console.log(err.message);
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
};

//check logged user
const checkLoggedUser = (req, res, next) => {
    const token = req.cookies.jwt;

    //check that JST token exist and verify
    if (token) {
        jwt.verify(token, 'Shohan', async (err, decodedToken) => {
            if (!err) {
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            } else {
                res.locals.user = null;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkLoggedUser };

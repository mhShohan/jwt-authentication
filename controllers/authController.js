const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handler = {};

//handle error of mongoose
function handleError(err) {
    // console.log(err.message,err.code);
    let errors = { email: '', password: '' };

    //incorrect email
    if (err.message === 'Provide Registered Email or Sign up...') {
        errors.email = err.message;
    }
    //incorrect password
    if (err.message === 'Incorrect Password!') {
        errors.password = err.message;
    }

    //handle Unique value error
    if (err.code === 11000) {
        errors.email = 'Email Already Registered!';
        return errors;
    }

    //validator error
    if (err.message.includes('user validation failed:')) {
        Object.values(err.errors).forEach((err) => {
            errors[err.properties.path] = err.properties.message;
        });
    }

    return errors;
}

//create token
function createToken(id) {
    return jwt.sign({ id }, 'Shohan', { expiresIn: 12 * 60 * 60 });
}

handler.getLogin = (req, res) => {
    res.render('login');
};

handler.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 12 * 60 * 60 * 1000,
        });

        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleError(error);
        res.status(401).json({ errors });
    }
};

handler.getSignup = (req, res) => {
    res.render('signup');
};

handler.postSignup = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 12 * 60 * 60 * 1000,
        });

        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
};

handler.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

module.exports = handler;

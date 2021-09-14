const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const { use } = require('../routes/authRoute');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Email...'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Provide a valid email..'],
    },
    password: {
        type: String,
        required: [true, 'Password is Required...'],
        minlength: [6, 'Password must have 6 charectets'],
    },
});

//fire the fucntion before data save to collection // Mongoose Hooks
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// static  method to login /custom mongoose method
userSchema.statics.login = async function (email, password) {
    //find the user by email
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect Password!');
    }
    throw Error('Provide Registered Email or Sign up...');
};

const User = mongoose.model('user', userSchema);

module.exports = User;

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoute');
const { requireAuth, checkLoggedUser } = require('./middlewere/authMiddlewere');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
dotenv.config();

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.URI;
mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then((result) =>
        app.listen(5000, () => console.log('http://localhost:5000'))
    )
    .catch((err) => console.log(err));

// routes
app.get('*', checkLoggedUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const usersController = require('./controllers/users.js');



const port = process.env.PORT || 3000;

console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passUserToView);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Log session data for debugging
app.use((req, res, next) => {
    console.log('Session Data:', req.session);  // Log the entire session data
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/vip-lounge', isSignedIn, (req, res) => {
    res.send(`Welcome to the party ${req.session.user.username}.`);
});

app.use('/auth', authController);
app.use(isSignedIn);  // Ensure user is signed in for the following routes
app.use('/users/:userId/foods', foodsController);
app.use('/users', usersController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});


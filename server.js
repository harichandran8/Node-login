// Import required modules
const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const nocache = require('nocache');

// Create an Express app
const app = express();

// Set Handlebars (HBS) as the template engine
app.set('view engine', 'hbs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Middleware to handle form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Hardcoded login credentials
const username = "admin";
const password = "1234";

// Set up session middleware to track user login
app.use(session({
    secret: 'keyboard cat', // Key to encrypt session
    resave: false,          // Do not save session if unchanged
    saveUninitialized: true // Save empty sessions
}));

// Prevent caching of pages
app.use(nocache());

// Route for login or home page
app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home'); // Show home page if logged in
    } else if (req.session.passwordwrong) {
        res.render('login', { msg: "Invalid Username & Password" }); // Show error if login fails
    } else {
        req.session.passwordwrong = false; // Reset error flag
        res.render('login'); // Show login page
    }
});

// Route to check login credentials
app.post('/verify', (req, res) => {
    console.log(req.body); // Debugging: log form data

    if (req.body.username === username && req.body.password === password) {
        req.session.user = req.body.username; // Save user in session
        res.redirect('/home'); // Go to home page
    } else {
        req.session.passwordwrong = true; // Set error flag for wrong login
        res.redirect('/'); // Go back to login page
    }
});

// Route for the home page
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home'); // Show home page if logged in
    } else if (req.session.passwordwrong) {
        req.session.passwordwrong = false; // Reset error flag
        res.render('login', { msg: "Invalid Username & Password" }); // Show error message
    } else {
        res.render('login'); // Show login page
    }
});

// Route to log out
app.get('/logout', (req, res) => {
    req.session.destroy(); // End the session
    res.render('login', { msg: "Logged Out" }); // Show logout message
});

// Start the server on port 3000
app.listen(3000, () => console.log("Server running on port 3000"));

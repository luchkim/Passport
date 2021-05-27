const router = require('express').Router();
const passport = require('passport');
const getPassword = require('../lib/passwordUtils').genPassword;    // generate password
const User = require('../config/db');
const isAuth = require('./auth').isAuth;
const isAdmin = require('./auth').isAdmin;


router.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/login-success'}));

router.post('/register', (req, res, next) => {
    const saltHash = getPassword(req.body.password); // it generate salt, and hash, then returns the object contains hash & salt

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        admin: true,
    });

    newUser.save().then(user=>{console.log(user)});

    res.redirect('/login')
});

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

router.get('/admin', isAdmin, (req, res, next) => {
    res.send('You are an admin')
});

router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('You are Authenticated... ')
});


// router.get('/protected-route', (req, res, next) => {
    
//     if (req.isAuthenticated()) {
//         res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
//     } else {
//         res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
//     }
// });

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
    if (req.session.client == 'client') {
        return res.redirect('/');
    }
    console.log('login get', res.locals.message);
    res.render('login', { message: res.locals.message });
});


router.post('/login', (req, res, next) => {
    passport.authenticate('client-local', { session: false }, (err, user, info) => {

        console.log('login post : ', err, user);
        if (err || !user) {
            req.flash('error', 'Invalid username/password');
            return res.redirect('/login');
        }

        req.session.client = 'client';
        req.session.clientUser = user;

        return res.redirect('/');
    })(req, res, next);
});


router.post('/admin/adminloginsubmit', (req, res, next) => {
    passport.authenticate('admin-local', { session: false }, (err, user, info) => {
        if (err || !user) {
            req.session.message = "Invalid username/password";
            return res.redirect('/admin/login');
        }

        req.session.admin = 'admin';
        req.session.adminUser = user;

        return res.redirect('/admin/dashboard');
    })(req, res, next);
});

router.get('/admin/logout', (req, res) => {
    req.session.admin = '';
    req.session.adminId = '';
    res.redirect('/admin/login');
});

router.get('/logout', (req, res) => {
    req.session.client = '';
    req.session.clientId = '';
    res.redirect('/login');
});

// Redirect to Google for authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Handle callback from Google
/* router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/', // Redirect after successful login
        failureRedirect: '/login', // Redirect if login fails
    })
); */

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        /* if (err || !user) {
          return res.redirect('/login');
        }
        // Manually update the session
        req.session.user = user;  // or any custom session property
        return res.redirect('/'); */

        console.log('login post : ', err, user);
        if (err || !user) {
            req.flash('error', 'Invalid username/password');
            return res.redirect('/login');
        }

        req.session.client = 'client';
        req.session.clientUser = user;

        return res.redirect('/');


    })(req, res, next);
});



router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login',
    })
);

module.exports = router;

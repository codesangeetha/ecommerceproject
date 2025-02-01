const express = require('express');
const passport = require('passport');
const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  console.log('login get', res.locals.message);
  res.render('login', { message: res.locals.message });
});

// Handle login POST request
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid email or password.', // Optional: Display flash messages
  })
);

// Handle logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    
    res.redirect('/login');
  });
});

// Redirect to Google for authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle callback from Google
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/', // Redirect after successful login
    failureRedirect: '/login', // Redirect if login fails
  })
);


router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

module.exports = router;

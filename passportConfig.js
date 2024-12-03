const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/users.model'); // Adjust path to your user model

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email', // Use 'email' as username
            passwordField: 'password', // Use 'password' for authentication
        },
        async (email, password, done) => {

            console.log('passport');
            console.log('email', email);
            console.log('password', password);

            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                console.log("user exists");
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                if (!user.status) {
                    return done(null, false, { message: 'Your account is inactive.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLECLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user in your database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value, // Use the primary email
            status: true, // Set default account status
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);



passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


module.exports = passport;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/users.model'); // Adjust path to your user model
const Adminusers = require("./models/adminusers");

passport.use('client-local',
    new LocalStrategy(
        {
            usernameField: 'email', // Use 'email' as username
            passwordField: 'password', // Use 'password' for authentication
        },
        async (email, password, done) => {

            // console.log('passport');
            // console.log('email', email);
            // console.log('password', password);

            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                // console.log("user exists");
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

passport.use('admin-local',
    new LocalStrategy(
        {
            usernameField: 'username', // Use 'email' as username
            passwordField: 'password', // Use 'password' for authentication
        },
        async (username, password, done) => {

            // console.log('passport');
            // console.log('password', password);

            try {
                const user = await Adminusers.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'Invalid username or password.' });
                }

                // console.log("admin user exists");
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
            callbackURL: 'https://ecommerceproject-4mp2.onrender.com/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                console.log('user: ', profile);
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // If user exists but doesn't have a Google ID, update it
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                } else {
                    // Create a new user
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        status: true,
                    });
                }
                return done(null, user );
            } catch (err) {
                return done(err);
            }
        }
    )
);


passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOKCLIENTID,
        clientSecret: process.env.FACEBOOKCLIENTSECRET,
        callbackURL: 'https://ecommerceproject-4mp2.onrender.com/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'photos'], // Request fields
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("profile fb: ", profile);
        let user = await User.findOne({ fbId: profile?.id });
        if (!user) {
            user = await User.create({
                fbId: profile.id,
                name: profile.displayName,
                email: "",
                status: true,
            });
        }
        return done(null, user);
    }
));



passport.serializeUser((user, done) => {
    if (user.role == 'admin') {
        done(null, { id: user.id, role: 'admin' });
    } else if (user.role == 'client') {
        done(null, { id: user.id, role: 'client' });
    } else {
        done(new Error("Unknown user role"));
    }
});

passport.deserializeUser(async (obj, done) => {
    try {
        if (obj.role == 'admin') {
            const user = await Adminusers.findById(obj.id);
            done(null, user);
        } else if (obj.role == 'client') {
            const user = await User.findById(obj.id);
            done(null, user);
        } else {
            done(new Error('Unknown user role'));
        }

    } catch (error) {
        done(error);
    }
});


module.exports = passport;

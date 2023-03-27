const express = require('express')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
require('dotenv').config()

const router = express.Router()

// Serialize and deserialize the user
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

// Configure passport with the Github strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.REACT_APP_GITHUB_CLIENT_ID,
            clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
            callbackURL: process.env.REACT_APP_GITHUB_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, done) {
            // Use the profile information (email, name, etc.) to create a new user
            // or authenticate an existing user in your application's database.
            // Then call the `done` function to complete the authentication process.
            // For example:
            //save user data to the database:
            //User.findOne({ githubId: profile.id }, function (err, user) {
            //   if (err) { return done(err); }
            //   if (!user) {
            //     user = new User({
            //       githubId: profile.id,
            //       username: profile.username,
            //       displayName: profile.displayName,
            //       profileUrl: profile.profileUrl,
            //       email: profile.emails[0].value
            //     });
            //     user.save(function (err) {
            //       if (err) console.log(err);
            //       return done(err, user);
            //     });
            //   } else {
            //     return done(err, user);
            //   }
            // });
            const user = {
                id: profile.id,
                username: profile.username,
                email: profile.emails[0].value,
            }
            console.log(user)
            done(null, user)
        }
    )
)

// Redirect the user to Github for authentication
router.get('/github', passport.authenticate('github'))

// Github will redirect the user to this URL after authentication
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect to dashboard.
        res.redirect('/')
        console.log('Success')
    }
)

module.exports = router

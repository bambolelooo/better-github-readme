const express = require('express')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const { User } = require('../models')
const jwt = require('jsonwebtoken')
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
            const playload = {
                user: {
                    token: accessToken,
                    id: profile.id,
                    name: profile.username,
                },
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            }
            const token = jwt.sign(playload, process.env.REACT_APP_JWT_SECRET)
            done(null, token)
        }
    )
)

// Redirect the user to Github for authentication
router.get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
)

// Github will redirect the user to this URL after authentication
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect to dashboard.
        // before deployment change this to /, configering heroku
        const token = req.user
        res.redirect(process.env.REACT_APP_FRONTEND_URL + '?token=' + token)

        console.log('Success')
    }
)

module.exports = router

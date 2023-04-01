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
        async function (accessToken, refreshToken, profile, done) {
            try {
                let user = await User.findOne({
                    githubUsername: profile.username,
                })

                if (!user) {
                    user = new User({
                        githubUsername: profile.username,
                        accessToken: accessToken,
                    })
                    await user.save()
                } else if (user.accessToken !== accessToken) {
                    user.accessToken = accessToken
                    await user.save()
                }

                const playload = {
                    user: {
                        id: profile.id,
                        name: profile.username,
                    },
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                }
                const token = jwt.sign(
                    playload,
                    process.env.REACT_APP_JWT_SECRET
                )
                return done(null, token)
            } catch (error) {
                return done(error)
            }
        }
    )
)

// Github will redirect the user to this URL after authentication
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect to dashboard.

        const token = req.user

        res.redirect(process.env.REACT_APP_FRONTEND_URL + '?token=' + token)

        console.log('Successfully authenticated')
    }
)

module.exports = router

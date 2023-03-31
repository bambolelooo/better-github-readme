require('dotenv').config()
const express = require('express')
const cors = require('cors') // import cors package
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const path = require('path')

const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection')
const passport = require('passport')
const authRouter = require('./utils/auth')
const imageRouter = require('./utils/image')
const readmeRouter = require('./utils/postReadme')
const repoRouter = require('./utils/getRepo')
const session = require('express-session')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 3001
const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        // Get the JWT token from the request header
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.substring(7)
        if (!token) {
            return {}
        }
        const [header, payload, signature] = token.split('.')
        const decodedPayload = JSON.parse(atob(payload))
        try {
            // Verify the token with your secret key
            const decodedToken = jwt.verify(
                token,
                process.env.REACT_APP_JWT_SECRET
            )

            // Return the user object from the decoded token
            return { user: decodedPayload }
        } catch (err) {
            // If the token is invalid, throw an authentication error
            throw new AuthenticationError('Invalid token')
        }
    },
})

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)

app.use(cors()) // enable CORS for all routes

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// passport package middleware
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)
app.use('/api/image', imageRouter)
app.use('/api/readme', readmeRouter)
app.use('/api/repo', repoRouter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
}

app.get('/', (req, res) => {
    res.sendFile('../client/build/index.html', { root: __dirname })
})

const startApolloServer = async (typeDefs, resolvers) => {
    await server.start()
    server.applyMiddleware({ app })

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`)
            console.log(
                `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
            )
        })
    })
}

// Call the async function to start the server
startApolloServer(typeDefs, resolvers)

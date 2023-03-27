require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const path = require('path')

const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection')
const passport = require('passport')
const authRouter = require('./utils/auth')
const session = require('express-session')

const PORT = process.env.PORT || 3001
const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers,
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

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// passport package middleware
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
}

app.get('/', (req, res) => {
    console.log(req.user)
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
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

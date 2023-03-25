require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const path = require('path')

const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection')

const cors = require('cors')
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET

const PORT = process.env.PORT || 3001
const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

//code being sent from front end
app.get('/getAccessToken', async (req, res) => {
    const code = req.query.code
    console.log(code)
    const params =
        '?client_id=' +
        client_id +
        '&client_secret=' +
        client_secret +
        '&code=' +
        code

    // fetch access token from github
    const response = await fetch(
        'https://github.com/login/oauth/access_token' + params,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        }
    )
    const data = await response.json()
    console.log(data)
    res.json(data)
})

//get user info from github
app.get('/getUserInfo', async (req, res) => {
    const access_token = req.query.access_token
    console.log(access_token)
    const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            Authorization: 'token ' + access_token,
        },
    })
    const data = await response.json()
    console.log(data)
    res.json(data)
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

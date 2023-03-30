const express = require('express')
const router = express.Router()
require('dotenv').config()
const { Octokit } = require('octokit')

router.get('/', async (req, res) => {
    const { text, token, name: username } = req.body
    const octokit = new Octokit({
        auth: token,
    })

    const response = await octokit.request('GET /users/{username}/repos', {
        username: username,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        },
    })

    return res.status(response.status).json(response)
})

module.exports = router

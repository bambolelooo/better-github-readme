const express = require('express')
const router = express.Router()
require('dotenv').config()
const { Octokit } = require('octokit')

router.post('/', async (req, res) => {
    const { text, token, name: username } = req.body
    const octokit = new Octokit({
        auth: token,
    })
    const repoName = 'publicTest'
    const fileName = 'README.md'
    // retrieve the current content and SHA-1 hash of the file you want to update
    const getResponse = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
            owner: username,
            repo: repoName,
            path: fileName,
        }
    )
    const sha = getResponse.data.sha // use the SHA-1 hash from the response

    const response = await octokit.request(
        'PUT /repos/{owner}/{repo}/contents/{path}',
        {
            owner: username,
            repo: repoName,
            path: fileName,
            message: 'update README.MD',
            committer: {
                name: 'Better Github Readme',
                email: `null`,
            },
            content: btoa(text),
            sha: sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    )
    return res.status(response.status).json(response)
})

module.exports = router

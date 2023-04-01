const { AuthenticationError } = require('apollo-server-express')
const { GraphQLNonNull, GraphQLString } = require('graphql')
const { Octokit } = require('octokit')
const { User } = require('../models')
const updateReadmeMutation = {
    type: GraphQLString,
    args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        repositoryName: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, { text, repositoryName }, { user }) {
        console.log('got a request')
        console.log(repositoryName)
        // Check if the user is authenticated
        if (!user) {
            throw new AuthenticationError(
                'You must be logged in to perform this action'
            )
        }
        const username = user.user.name
        let accessToken
        await User.findOne({ githubUsername: username })
            .then((user) => {
                if (!user) {
                    // Handle error: User not found
                } else {
                    accessToken = user.accessToken
                    console.log(accessToken)
                    // Use the access token as needed
                }
            })
            .catch((error) => {
                // Handle error: Failed to retrieve user data
            })
        const octokit = new Octokit({
            auth: accessToken,
        })

        // retrieve the current content and SHA-1 hash of the file you want to update
        const getResponse = await octokit.request(
            'GET /repos/{owner}/{repo}/contents/{path}',
            {
                owner: username,
                repo: repositoryName,
                path: 'README.md',
            }
        )

        const sha = getResponse.data.sha // use the SHA-1 hash from the response

        try {
            const response = await octokit.request(
                'PUT /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: username,
                    repo: repositoryName,
                    path: 'README.md',
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
            console.log(response)
        } catch (e) {
            console.log(e)
        }
        return 'README.md updated successfully!'
    },
}

module.exports = updateReadmeMutation

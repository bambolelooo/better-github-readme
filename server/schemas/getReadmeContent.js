const { AuthenticationError } = require('apollo-server-express')
const { GraphQLNonNull, GraphQLString } = require('graphql')
const { Octokit } = require('octokit')
const { User } = require('../models')

const getReadmeContent = {
    type: GraphQLString,
    args: {
        repositoryName: { type: new GraphQLNonNull(GraphQLString) },
    },

    async resolve(_, { repositoryName }, { user }) {
        console.log('got a request')
        const repoName = repositoryName.slice(1, -1)
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
                    // Use the access token as needed
                }
            })
            .catch((error) => {
                // Handle error: Failed to retrieve user data
                console.log(error)
            })

        const octokit = new Octokit({
            auth: accessToken,
        })

        // Send a request to get the README content for the given repository
        const readme = await octokit.request(
            'GET /repos/{owner}/{repo}/contents/{path}',
            {
                owner: username,
                repo: repoName,
                path: 'README.md',
            }
        )
        return Buffer.from(readme.data.content, 'base64').toString()
    },
}

module.exports = getReadmeContent

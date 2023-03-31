const { AuthenticationError } = require('apollo-server-express')
const { GraphQLNonNull, GraphQLString } = require('graphql/type')
const { Octokit } = require('octokit')
const updateReadmeMutation = {
    type: GraphQLString,
    args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        repositoryName: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, { text, repositoryName }, { user }) {
        // Check if the user is authenticated
        if (!user) {
            throw new AuthenticationError(
                'You must be logged in to perform this action'
            )
        }
        console.log(user)
        const octokit = new Octokit({
            auth: user.token,
        })

        // retrieve the current content and SHA-1 hash of the file you want to update
        const getResponse = await octokit.request(
            'GET /repos/{owner}/{repo}/contents/{path}',
            {
                owner: user.username,
                repo: repositoryName,
                path: 'README.MD',
            }
        )

        const sha = getResponse.data.sha // use the SHA-1 hash from the response

        const response = await octokit.request(
            'PUT /repos/{owner}/{repo}/contents/{path}',
            {
                owner: user.username,
                repo: repositoryName,
                path: 'README.MD',
                message: 'Update README.md',
                committer: {
                    name: 'Better Github Readme',
                    email: 'noreply@better-readme.com',
                },
                content: btoa(text),
                sha: sha,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            }
        )

        return 'README.md updated successfully!'
    },
}

module.exports = updateReadmeMutation

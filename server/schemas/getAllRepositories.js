const { AuthenticationError } = require('apollo-server-express')
const { GraphQLNonNull, GraphQLString, GraphQLList } = require('graphql')
const { Octokit } = require('octokit')
const { User } = require('../models')

const getRepositories = {
    type: new GraphQLList(GraphQLString),

    async resolve(_, __, { user }) {
        console.log('got a request')
        const username = user.user.name
        // Check if the user is authenticated
        if (!user) {
            throw new AuthenticationError(
                'You must be logged in to perform this action'
            )
        }

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

        // Send a GraphQL query to fetch the first 100 repositories for the given user
        const { user: githubUser } = await octokit.graphql(
            `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100) {
            nodes {
              name
              url
            }
          }
        }
      }
    `,
            {
                username,
            }
        )

        // Extract the names of the repositories from the response and return them as an array
        const repositories = githubUser.repositories.nodes.map(
            (repo) => repo.name
        )
        console.log(repositories)
        return repositories
    },
}

module.exports = getRepositories

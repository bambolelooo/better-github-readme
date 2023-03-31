const { User, Readme, Snippet, Template } = require('../models')
const updateReadmeMutation = require('./updateReadmeMutation')
const resolvers = {
    Query: {
        user: async () => {
            return User.findOne({}).populate('repos')
        },
        getReadme: async (parent, { repoId }) => {
            return Readme.findOne({ _id: repoId })
        },
        getSnippets: async (parent, { snippetId }) => {
            return Snippet.findOne({ _id: snippetId }).populate(
                'snippetContent'
            )
        },
        getTemplates: async (parent, { templateId }) => {
            return Template.findOne({ _id: templateId }).populate(
                'templateContent'
            )
        },
    },
    Mutation: {
        SaveReadme: async (parent, { repoId, readmeContent }) => {
            const readme = await Readme.findOneAndUpdate(
                { _id: repoId },
                { readmeContent },
                { new: true }
            )
            return readme
        },
        updateAccessToken: async (parent, { accessToken }) => {
            const user = await User.findOneAndUpdate(
                {},
                { accessToken },
                { new: true }
            )
            return user
        },
        updateReadme: updateReadmeMutation,
    },
}

module.exports = resolvers

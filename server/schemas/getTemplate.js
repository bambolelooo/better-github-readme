const { GraphQLNonNull, GraphQLString } = require('graphql')
const { Template } = require('../models')

const getTemplate = {
    type: GraphQLString,
    args: {
        templateName: { type: new GraphQLNonNull(GraphQLString) },
    },

    async resolve(_, { templateName }, __) {
        // Check if the user is authenticated
        let content
        await Template.findOne({ templateName: templateName })
            .then((template) => {
                if (!template) {
                    console.log('template not found')
                    return 'template not found'
                } else {
                    content = template.templateContent
                }
            })
            .catch((error) => {
                // Handle error: Failed to retrieve user data
                console.log(error)
                return error
            })

        return Buffer.from(content, 'utf-8').toString()
    },
}

module.exports = getTemplate

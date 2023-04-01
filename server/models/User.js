const { Schema, model, Types } = require('mongoose')

// Schema to create User model
const userSchema = new Schema(
    {
        githubUsername: {
            type: String,
            unique: true,
            required: true,
            max_length: 50,
        },
        accessToken: {
            type: String,
            required: true,
        },
        repos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Repo',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
)

// get total count of repos
userSchema.virtual('repoCount').get(function () {
    return this.repos.length
})

// create the User model using the userSchema
const User = model('User', userSchema)

module.exports = User

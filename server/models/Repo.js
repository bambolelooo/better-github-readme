const { Schema, model } = require('mongoose');

// Schema to create Repo model
const repoSchema = new Schema(
    {
      repoName: {
         type: String,
         required: true,
      },
      githubUsername: {
         type: String,
         required: true,
      },
    },
    {
      toJSON: {
         getters: true,
      },
    }
);
  
const Repo = model('Repo', repoSchema);
  
module.exports = Repo;
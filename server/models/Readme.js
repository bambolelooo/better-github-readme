const { Schema, model } = require('mongoose');

// Schema to create Readme model
const readmeSchema = new Schema(
  {
    repoName: {
        type: String,
        required: true,
    },
    readmeContent: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Readme = model('Readme', readmeSchema);

module.exports = Readme;
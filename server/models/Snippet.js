const { Schema, model } = require('mongoose');

// Schema to create Snippet model
const snippetSchema = new Schema(
  {
    snippetName: {
      type: String,
      required: true,
    },
    snippetContent: { 
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

const Snippet = model('Snippet', snippetSchema);

module.exports = Snippet;
const { Schema, model } = require('mongoose');

// Schema to create Template model
const templateSchema = new Schema(
  {
    templateName: {
      type: String,
      required: true,
    },
    templateContent: {
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

const Template = model('Template', templateSchema);

module.exports = Template;
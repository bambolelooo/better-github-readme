const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    githubUsername: String
    email: String
    repos: [Repo]
  }

  type Repo {
    _id: ID
    repoName: String
    repoLink: String
  }

  type Readme {
    _id: ID
    repoId: ID
    readmeContent: String
  }

  type Snippet {
    _id: ID
    snippetName: String
    snippetContent: String
  }

  type Template {
    _id: ID
    templateName: String
    templateContent: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getReadme(repoId: ID!): Readme
    getSnippets: [Snippet]
    getTemplates: [Template]
  }

  type Mutation {
    SaveReadme(repoId: ID!, readmeContent: String!): Readme
  }
`;

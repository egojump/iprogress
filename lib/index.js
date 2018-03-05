// eslint-disable-next-line import/no-unassigned-import
require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')
const bcrypt = require('bcrypt')
const User = require('./models/user')

const typeDefs = [
  `
type Query {
  hello: String
}

type User {
  username: String!
  email: String!
}

type Mutation {
  createUser(
    username: String!
    email: String!
    password: String!
  ): User
}

schema {
  query: Query
  mutation: Mutation
}`,
]

const resolvers = {
  Query: {
    hello() {
      return 'world'
    },
  },
  Mutation: {
    async createUser(_, user) {
      const newUser = new User({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })
      return newUser.save()
    },
  },
}

const schema = makeExecutableSchema({typeDefs, resolvers})
const app = express()

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}))
app.listen(4000, () =>
  console.log('Now browse to http://localhost:4000/graphiql')
)

// eslint-disable-next-line import/no-unassigned-import
require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const uuidv4 = require('uuid/v4')
const { makeExecutableSchema } = require('graphql-tools')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const LoginCode = require('./models/login-code')

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

  createLoginCode(email: String!): Boolean
}

schema {
  query: Query
  mutation: Mutation
}`
]

const resolvers = {
  Query: {
    hello() {
      return 'world'
    }
  },
  Mutation: {
    async createUser(_, user) {
      const newUser = new User({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      })
      return newUser.save()
    },
    async createLoginCode(_, args) {
      let code
      const existing = await LoginCode.findOne({ email: args.email })
      if (existing) {
        // Using existing code if it's not expired
        if (Date.now() - new Date(existing.updateAt).getTime() < 60 * 10 * 1000) {
          code = existing.code
        } else {
          code = uuidv4()
          await existing.update({ code })
        }
      } else {
        code = uuidv4()
        const loginCode = new LoginCode({
          email: args.email,
          code,
        })
        await loginCode.save()
      }
      // Send email to user with the login code and magic link
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })
const app = express()

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.listen(4000, () =>
  console.log('Now browse to http://localhost:4000/graphiql')
)

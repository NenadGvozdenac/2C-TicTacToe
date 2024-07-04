const userSchema = `#GraphQL
    type User {
        id: ID!
        username: String!
        password: String!    
    }

    type JWTResponse {
        message: String
        token: String
    }

    type Query {
        users: [User]
        user(id: ID!): User
        userByUsername(username: String!): User
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): User
        login(username: String!, password: String!): JWTResponse
    }

`

export default userSchema;
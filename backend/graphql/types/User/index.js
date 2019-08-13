export default `
  type User {
    id: ID
    username: String
    jwt: String
    mail: String
    fullname: String
    role: String
  }

  type Query {
    login(username: String!, password: String!): User
    me: User
    profile(username:String!): User
    users: [User!]!
  }

  type Mutation {
    createUser(user: SignUpRequest): User!
    addUserFromLDAP(username: String): User
  }

  input SignUpRequest {
    username: String!
    password: String!
  }
`;

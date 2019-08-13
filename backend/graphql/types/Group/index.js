export default `
  type Group {
    id: ID
    name: String
    description: String
  }

  type Query {
    group(name: String!): Group
    groups: [Group!]
  }

  type Mutation {
    createGroup(request: CreateGroupRequest): Group!
  }


  input CreateGroupRequest {
    name: String!
    description: String
  }
`;


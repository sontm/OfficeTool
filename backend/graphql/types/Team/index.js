import {
    GraphQLString,
    GraphQLInt,
    GraphQLInputObjectType,
    GraphQLNonNull,
  } from 'graphql';
  
  export default `
    type Member {
      id: ID!
      username: String!
      percent: Int!
      role: String!
    }
    type Team {
      id: ID!
      name: String!
      groupName: String!
      description: String
      members: [Member!]!
    }
  
  
    type Query {
      team(id: ID!): Team!
      team(name: String!): Team!
      teams: [Team!]!
    }
    type Mutation {
      createTeam(request: CreateTeamInput): Team!
      addMemberToTeam(request: AddMemberInput): Team!
      deleteMemberFromTeam(request: DeleteMemberInput): Team!
    }
  
  
    input CreateTeamInput {
      name: String!
      groupName: String!
      description: String
    }
    input AddMemberInput {
      teamID: ID!
      username: String!
      percent: Int!
      role: String!
    }
    input DeleteMemberInput {
      teamID: ID!
      username: String!
    }
  `;
  
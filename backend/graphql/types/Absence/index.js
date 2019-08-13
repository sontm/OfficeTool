import {
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLNonNull,
  } from 'graphql';
  
  import {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
  } from 'graphql-iso-date';
  
  export default `
    scalar Date
    type Absence {
      id: ID!
      fromDate: Date!
      fromPeriod: String!
      toDate: Date!
      toPeriod: String!
      description: String
      username: String!
      status: String
      feedBack: String
      approver: String
    }
  
  
    type Query {
      absence(username: String!, status: String): [Absence!]!
      absenceApprove(approver: String!, status: String): [Absence!]!
      absences: [Absence!]!
    }
    type Mutation {
      createAbsence(request: CreateAbsenceInput): Absence!
      updateAbsenceStatus(request: UpdateAbsenceStatusInput): Absence!
    }
  
  
    input CreateAbsenceInput {
      fromDate: String!
      fromPeriod: String!
      toDate: String!
      toPeriod: String!
      description: String
      username: String!
      approver: String!
    }

    input UpdateAbsenceStatusInput {
        id: ID!
        status: String!
        feedBack: String
      }
    
  `;
  
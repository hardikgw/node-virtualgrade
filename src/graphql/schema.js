import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { Assignment, Assignments } from './models/Assignment';

import {getUser} from './queries/user';

const typeDefs = `
	scalar Date
	type SubmissionType {
    id: ID!
    type: String
	}
	input SubmissionStepInput {
    name: String!
    start_date: Date!
    end_date: Date!
    files: [String!]!
    allow_other_files: Boolean!
	}
	type SubmissionStep {
    id: ID!
    name: String!
    start_date: Date!
    end_date: Date!
    files: [String!]!
    allow_other_files: Boolean!
	}
	input AssignmentInput {
    name: String!
    description: String
    submission_steps: [SubmissionStepInput]
	}
	type Assignment {
    id: ID!
    name: String!
    description: String
    type: SubmissionType
    submission_steps: [SubmissionStep!]!
  }
  type Course {
    id: ID!
    name: String
    assignments: [Assignment]
    term: Term
  }
  type Department {
    id: ID!
    name: String
    courses: [Course]
  }
  type Term {
    id: ID!
    term: String
  }
  type Manage {
    departments: [Department]
  }
  type User {
    id: ID
    username: String!
    groups: [String!]
    term: Term
    admin: [Course]
    grading: [Course]
    manage: Manage
    courses: [Course]
    instr: [Course]
  }
  type Query {
    assignments: [Assignment],
    user: User
	}
	type Mutation {
    addAssignment(assignment: AssignmentInput!): Assignment
	}
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
  Query: {
    assignments: (obj, args, context, info) => {
      console.log(context);
      return Assignments.forge().fetch({
        withRelated: ['submission_steps']
      }).then(function (a) {
        return a.toJSON();
      });
    },
    user: getUser
  },
  Mutation: {
    addAssignment: (root, {assignment}) => {
      console.log(assignment);
      Assignment
        .forge(assignment)
        .save()
        .tap(assignment => Promise.map(assignment.steps, step => assignment.related('submission_steps').create(step)))
        .then(assignment => assignment);
    }
  }
};

export default makeExecutableSchema({
    typeDefs,
    resolvers
});
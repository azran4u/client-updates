import { gql } from 'apollo-server';

export const moQuery = gql`
  type Query {
    getAllMo: [Mo]!
    getMoByIds(ids: [ID]!): [Mo]!
  }
`;

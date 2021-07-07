// import { gql } from 'apollo-server-express';
// import { createTestClient } from 'apollo-server-testing';
// import { UserController } from '../entities/parlament/operation/controller/operation.controller';
// import { User } from '../entities/parlament/operation/operation.model';
// import sinon, { mock, SinonStub } from 'sinon';
// import { expect } from 'chai';
// import { apolloServer } from '../graphql/apolloServer';

// function aUser(id: string): User {
//   return {
//     id,
//     name: `name-${id}`,
//     age: 10,
//     posts: [],
//   };
// }

// describe(`Grpahql API testing`, () => {
//   const users: User[] = [aUser('1'), aUser('2')];

//   beforeEach(function () {});

//   afterEach(function () {});

//   it('fetch all users', async () => {
//     const userControllerGetAllStub = sinon.stub(
//       UserController,
//       'getAll',
//     );
//     userControllerGetAllStub.returns(Promise.resolve(users));
//     const { query } = createTestClient(apolloServer);
//     const GET_ALL_USERS = gql`
//       query q1 {
//         getAllUsers {
//           id
//           name
//         }
//       }
//     `;

//     const res = await query({ query: GET_ALL_USERS, variables: {} });

//     expect(res.data.getAllUsers).to.eql(users);
//     expect(userControllerGetAllStub.calledOnce).to.be.true;

//     userControllerGetAllStub.restore();
//   });

//   it('create user', async () => {
//     const mockUser = aUser('1');
//     const userControllerAddUserStub = sinon.stub(
//       UserController,
//       'create',
//     );
//     userControllerAddUserStub.returns(Promise.resolve(mockUser));
//     const { query } = createTestClient(apolloServer);
//     const ADD_USER = gql`
//       mutation m1($name: String!) {
//         addUser(name: $name) {
//           id
//           name
//         }
//       }
//     `;

//     const res = await query({
//       query: ADD_USER,
//       variables: { name: mockUser.name },
//     });

//     expect(res.data.addUser).to.eql(mockUser);
//     expect(userControllerAddUserStub.calledOnce).to.be.true;

//     userControllerAddUserStub.restore();
//   });
// });

import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BaseEntity, ID, Mo, Operation } from './parlament.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ParlamentService {
  private client: ApolloBase;

  constructor(private apollo: Apollo) {
    this.client = this.apollo.use('parlament');
  }

  getOperationsByIds(ids: ID[]): Observable<Operation[]> {
    if (!this) console.error(`this.client undefined`);
    if (_.isEmpty(ids)) return of([]);
    return this.client
      .query<{ operations: Operation[] }>({
        query: gql`
          query operationsByIds($ids: [String!]) {
            operations(where: { id: { _in: $ids } }) {
              id
              name
              mos {
                id
              }
              updatedAt
            }
          }
        `,
        variables: { ids }
      })
      .pipe(map((res) => res.data?.operations ?? []));
  }

  subscribeToOperationsByName(names: string[]): Observable<BaseEntity[]> {
    if (_.isEmpty(names)) return of([]);
    return this.client
      .subscribe<{
        operations: BaseEntity[];
      }>({
        query: gql`
          subscription subscribeToOperationsByNames($names: [String!]) {
            operations(where: { name: { _in: $names } }) {
              id
              updatedAt
            }
          }
        `,
        variables: { names }
      })
      .pipe(map((res) => res.data?.operations ?? []));
  }

  getMoByIds(ids: ID[]): Observable<Mo[]> {
    if (_.isEmpty(ids)) return of([]);
    return this.client
      .query<{ mos: Mo[] }>({
        query: gql`
          query mosByIds($ids: [String!]) {
            mos(where: { id: { _in: $ids } }) {
              id
              name
              areas {
                id
              }
              updatedAt
            }
          }
        `,
        variables: { ids }
      })
      .pipe(map((res) => res.data?.mos ?? []));
  }

  subscribeToMosByIds(ids: string[]): Observable<BaseEntity[]> {
    if (_.isEmpty(ids)) return of([]);
    return this.client
      .subscribe<{
        mos: BaseEntity[];
      }>({
        query: gql`
          subscription subscribeToMosByIds($ids: [String!]) {
            mos(where: { id: { _in: $ids } }) {
              id
              updatedAt
            }
          }
        `,
        variables: { ids }
      })
      .pipe(map((res) => res.data?.mos ?? []));
  }
  // subscribeToMosByIds(ids: string[]): Observable<Mo[]> {
  //   if (_.isEmpty(ids)) return of([]);
  //   return this.client
  //     .subscribe<{
  //       mos: Mo[];
  //     }>({
  //       query: gql`
  //         subscription subscribeToMosByIds($mosids: [String!]) {
  //           mos(where: { name: { _in: $mosids } }) {
  //             id
  //             updated_at
  //           }
  //         }
  //       `,
  //       variables: { mosids: ids }
  //     })
  //     .pipe(map((res) => res.data?.mos ?? []));
  // }

  // operation;
  getAllOperations(): Observable<Operation[]> {
    return this.apollo
      .use('parlament')
      .query<{ operations: Operation[] }>({
        query: gql`
          query getAllOperations {
            operations {
              id
              name
              mosids
              updated_at
            }
          }
        `
      })
      .pipe(
        tap((data) =>
          console.log(
            `query getAllOperations value ${JSON.stringify(data, null, 4)}`
          )
        ),
        map((v) => v.data?.operations ?? [])
      );
  }

  // getOperationsByIds(ids: ID[]): Observable<Operation[]> {
  //   return this.apollo
  //     .use('parlament')
  //     .query<{ getOperationsByIds: Operation[] }>({
  //       query: gql`
  //         query getOperationsByIds {
  //           getOperationsByIds(ids: ${createIdsForQuery(ids)}) {
  //             id
  //             name
  //             mos
  //           }
  //         }
  //       `
  //     })
  //     .pipe(
  //       tap((v) =>
  //         console.log(
  //           `query getOperationsByIds value ${JSON.stringify(v, null, 4)}`
  //         )
  //       ),
  //       map((v) => v.data?.getOperationsByIds ?? [])
  //     );
  // }

  // updateOperations(upserted: Operation[], deleted: ID[]): Observable<Boolean> {
  //   return this.apollo
  //     .use('parlament')
  //     .mutate<{ changeOperations: Boolean }>({
  //       mutation: gql`
  //       mutation addOperations {
  //         changeOperations(upserted: ${createIdsForQuery(
  //           upserted.map((u) => JSON.stringify(u))
  //         )}, deleted: ${createIdsForQuery(deleted)})
  //       }
  //       `
  //     })
  //     .pipe(
  //       tap((v) =>
  //         console.log(
  //           `mutation changeOperations value ${JSON.stringify(v, null, 4)}`
  //         )
  //       ),
  //       map((v) => v.data?.changeOperations ?? false)
  //     );
  // }

  // subscribeToOperationChanges(ids: ID[]): Observable<EntityUpdate> {
  //   return this.apollo
  //     .use('parlament')
  //     .subscribe<{ operationsChanges: EntityUpdate }>({
  //       query: gql`
  //     subscription operationsChanges {
  //       operationsChanges(filter: { ids: ${createIdsForQuery(ids)} }) {
  //         upserted
  //         deleted
  //       }
  //     }
  //     `
  //     })
  //     .pipe(
  //       tap((v) =>
  //         console.log(
  //           `subscription operationsChanges value ${JSON.stringify(v, null, 4)}`
  //         )
  //       ),
  //       map((v) => v.data?.operationsChanges ?? { upserted: [], deleted: [] })
  //     );
  // }

  // mo
  // getAllMo(): Observable<Mo[]> {
  //   return this.apollo
  //     .use('parlament')
  //     .watchQuery<{ getAllMo: Mo[] }>({
  //       query: gql`
  //         query getAllMo {
  //           getAllMo {
  //             id
  //             name
  //             areas
  //           }
  //         }
  //       `,
  //       pollInterval: 1000
  //     })
  //     .valueChanges.pipe(
  //       tap((v) =>
  //         console.log(`query getAllMo value ${JSON.stringify(v, null, 4)}`)
  //       ),
  //       map((v) => v.data?.getAllMo ?? [])
  //     );
  // }

  // getMoByIds(ids: ID[]): Observable<Mo[]> {
  //   return this.apollo
  //     .use('parlament')
  //     .query<{ getMoByIds: Mo[] }>({
  //       query: gql`
  //         query getMoByIds {
  //           getMoByIds(ids: ${createIdsForQuery(ids)}) {
  //             id
  //             name
  //             areas
  //           }
  //         }
  //       `
  //     })
  //     .pipe(
  //       tap((v) =>
  //         console.log(`query getMoByIds value ${JSON.stringify(v, null, 4)}`)
  //       ),
  //       map((v) => v.data?.getMoByIds ?? [])
  //     );
  // }

  // updateMo(upserted: Mo[], deleted: ID[]): Observable<Boolean> {
  //   return this.apollo
  //     .use('parlament')
  //     .mutate<{ changeMo: Boolean }>({
  //       mutation: gql`
  //       mutation changeMo {
  //         changeMo(upserted: ${createIdsForQuery(
  //           upserted.map((u) => JSON.stringify(u))
  //         )}, deleted: ${createIdsForQuery(deleted)})
  //       }
  //       `
  //     })
  //     .pipe(
  //       tap((v) =>
  //         console.log(`mutation changeMo value ${JSON.stringify(v, null, 4)}`)
  //       ),
  //       map((v) => v.data?.changeMo ?? false)
  //     );
  // }

  // subscribeToMoChanges(ids: ID[]): Observable<EntityUpdate> {
  //   return this.apollo
  //     .use('parlament')
  //     .subscribe<{ moChanges: EntityUpdate }>({
  //       query: gql`
  //     subscription moChanges {
  //       moChanges(filter: { ids: ${createIdsForQuery(ids)} }) {
  //         upserted
  //         deleted
  //       }
  //     }
  //     `
  //     })
  //     .pipe(
  //       tap((v) =>
  //         console.log(
  //           `subscription moChanges value ${JSON.stringify(v, null, 4)}`
  //         )
  //       ),
  //       map((v) => v.data?.moChanges ?? { upserted: [], deleted: [] })
  //     );
  // }
}

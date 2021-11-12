import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createIdsForQuery } from './createIdsForQuery';
import { EntityUpdate, ID, Mo, Operation } from './parlament.model';
import * as _ from 'lodash';
import { FetchResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root'
})
export class ParlamentService {
  private client: ApolloBase;
  constructor(private apollo: Apollo) {
    this.client = this.apollo.use('parlament');
  }

  subscribeToOperationsByName(names: string[]): Observable<Operation[]> {
    if (_.isEmpty(names)) return of([]);
    return this.client
      .subscribe<{
        operations: Operation[];
      }>({
        query: gql`
          subscription subscribeToOperationsByNames($opnames: [String!]) {
            operations(where: { name: { _in: $opnames } }) {
              id
              updated_at
              mos {
                id
              }
            }
          }
        `,
        variables: { opnames: names }
      })
      .pipe(
        tap((v) =>
          console.log(
            `subscribeToOperationsByName value ${JSON.stringify(v, null, 4)}`
          )
        ),
        map((res) => res.data?.operations ?? [])
      );
  }

  // operation
  getAllOperations(): Observable<Operation[]> {
    return this.apollo
      .use('parlament')
      .query<{ getAllOperations: Operation[] }>({
        query: gql`
          query getAllOperations {
            getAllOperations {
              id
              name
              mos
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
        map((v) => v.data?.getAllOperations ?? [])
      );
  }

  getOperationsByIds(ids: ID[]): Observable<Operation[]> {
    return this.apollo
      .use('parlament')
      .query<{ getOperationsByIds: Operation[] }>({
        query: gql`
          query getOperationsByIds {
            getOperationsByIds(ids: ${createIdsForQuery(ids)}) {
              id
              name
              mos
            }
          }
        `
      })
      .pipe(
        tap((v) =>
          console.log(
            `query getOperationsByIds value ${JSON.stringify(v, null, 4)}`
          )
        ),
        map((v) => v.data?.getOperationsByIds ?? [])
      );
  }

  updateOperations(upserted: Operation[], deleted: ID[]): Observable<Boolean> {
    return this.apollo
      .use('parlament')
      .mutate<{ changeOperations: Boolean }>({
        mutation: gql`
        mutation addOperations {
          changeOperations(upserted: ${createIdsForQuery(
            upserted.map((u) => JSON.stringify(u))
          )}, deleted: ${createIdsForQuery(deleted)})
        }        
        `
      })
      .pipe(
        tap((v) =>
          console.log(
            `mutation changeOperations value ${JSON.stringify(v, null, 4)}`
          )
        ),
        map((v) => v.data?.changeOperations ?? false)
      );
  }

  subscribeToOperationChanges(ids: ID[]): Observable<EntityUpdate> {
    return this.apollo
      .use('parlament')
      .subscribe<{ operationsChanges: EntityUpdate }>({
        query: gql`
      subscription operationsChanges {
        operationsChanges(filter: { ids: ${createIdsForQuery(ids)} }) {
          upserted
          deleted
        }
      }
      `
      })
      .pipe(
        tap((v) =>
          console.log(
            `subscription operationsChanges value ${JSON.stringify(v, null, 4)}`
          )
        ),
        map((v) => v.data?.operationsChanges ?? { upserted: [], deleted: [] })
      );
  }

  // mo
  getAllMo(): Observable<Mo[]> {
    return this.apollo
      .use('parlament')
      .watchQuery<{ getAllMo: Mo[] }>({
        query: gql`
          query getAllMo {
            getAllMo {
              id
              name
              areas
            }
          }
        `,
        pollInterval: 1000
      })
      .valueChanges.pipe(
        tap((v) =>
          console.log(`query getAllMo value ${JSON.stringify(v, null, 4)}`)
        ),
        map((v) => v.data?.getAllMo ?? [])
      );
  }

  getMoByIds(ids: ID[]): Observable<Mo[]> {
    return this.apollo
      .use('parlament')
      .query<{ getMoByIds: Mo[] }>({
        query: gql`
          query getMoByIds {
            getMoByIds(ids: ${createIdsForQuery(ids)}) {
              id
              name
              areas
            }
          }
        `
      })
      .pipe(
        tap((v) =>
          console.log(`query getMoByIds value ${JSON.stringify(v, null, 4)}`)
        ),
        map((v) => v.data?.getMoByIds ?? [])
      );
  }

  updateMo(upserted: Mo[], deleted: ID[]): Observable<Boolean> {
    return this.apollo
      .use('parlament')
      .mutate<{ changeMo: Boolean }>({
        mutation: gql`
        mutation changeMo {
          changeMo(upserted: ${createIdsForQuery(
            upserted.map((u) => JSON.stringify(u))
          )}, deleted: ${createIdsForQuery(deleted)})
        }        
        `
      })
      .pipe(
        tap((v) =>
          console.log(`mutation changeMo value ${JSON.stringify(v, null, 4)}`)
        ),
        map((v) => v.data?.changeMo ?? false)
      );
  }

  subscribeToMoChanges(ids: ID[]): Observable<EntityUpdate> {
    return this.apollo
      .use('parlament')
      .subscribe<{ moChanges: EntityUpdate }>({
        query: gql`
      subscription moChanges {
        moChanges(filter: { ids: ${createIdsForQuery(ids)} }) {
          upserted
          deleted
        }
      }
      `
      })
      .pipe(
        tap((v) =>
          console.log(
            `subscription moChanges value ${JSON.stringify(v, null, 4)}`
          )
        ),
        map((v) => v.data?.moChanges ?? { upserted: [], deleted: [] })
      );
  }
}

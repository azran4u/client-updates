import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { createIdsForQuery } from '../../../shared/createIdsForQuery';
import { ID, Operation } from './parlament.model';

@Injectable({
  providedIn: 'root'
})
export class ParlamentService {
  constructor(private apollo: Apollo) {}

  // operation
  getAllOperations(): Observable<Operation[]> {
    return this.apollo
      .use('parlament')
      .query<Operation[]>({
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
        tap((v) => console.log(v)),
        map((v) => v.data['getAllOperations'] || [])
      );
  }

  getOperationsByIds(ids: ID[]): Observable<Operation[]> {
    return this.apollo
      .use('parlament')
      .query<Operation[]>({
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
      .pipe(map((v) => v.data['getOperationsByIds'] || []));
  }

  updateOperations(upserted: Operation[], deleted: ID[]): Observable<Boolean> {
    return this.apollo
      .use('parlament')
      .mutate<Boolean>({
        mutation: gql`
        mutation addOperations {
          changeOperations(upserted: ${createIdsForQuery(
            upserted.map((u) => JSON.stringify(u))
          )}, deleted: ${createIdsForQuery(deleted)})
        }        
        `
      })
      .pipe(
        tap((v) => console.log(v)),
        map((v) => v.data)
      );
  }

  subscribeToOperationChanges(
    ids: ID[]
  ): Observable<{ updated: ID[]; deleted: ID[] }> {
    return this.apollo
      .use('parlament')
      .subscribe<{ updated: ID[]; deleted: ID[] }>({
        query: gql`
      subscription operationChanges {
        operationsChanges(filter: { ids: ${createIdsForQuery(ids)} }) {
          upserted
          deleted
        }
      }
      `
      })
      .pipe(
        tap((v) => console.log(v)),
        map((v) => v.data)
      );
  }
}

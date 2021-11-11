import { ID } from '../features/parlament/parlament.model';
import * as _ from 'lodash';

export function createIdsForQuery(ids: ID[]): string {
  return `[${_.join(
    ids.map((id) => `"${id}"`),
    ','
  )}]`;
}

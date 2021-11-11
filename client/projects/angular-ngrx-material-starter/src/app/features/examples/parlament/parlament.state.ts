import { Area, ID, Mo, Operation } from './parlament.model';

export interface ParlamentState {
  operations: Map<ID, Operation>;
  mo: Map<ID, Mo>;
  areas: Map<ID, Area>;
}

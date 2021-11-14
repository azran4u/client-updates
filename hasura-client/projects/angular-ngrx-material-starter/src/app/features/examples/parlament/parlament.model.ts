export type ID = string;

export interface BaseEntity<T = ID> {
  id: T;
  updatedAt: string;
}
export interface ParlamentEntity extends BaseEntity<ID> {
  name: string;
  childs?: ID[];
}
export interface Operation extends ParlamentEntity {
  mosids: Mo['id'][];
}

export interface Mo extends ParlamentEntity {
  areas: Area['id'][];
}

export interface Area extends ParlamentEntity {}

export interface EntityUpdate<U = ID, D = ID> {
  upserted: U[];
  deleted: D[];
}

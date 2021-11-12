export type ID = string;

export interface ParlamentEntity {
  id: ID;
  name: string;
}
export interface Operation extends ParlamentEntity {
  mos: Mo['id'][];
}

export interface Mo extends ParlamentEntity {
  areas: Area['id'][];
}

export interface Area extends ParlamentEntity {}

export interface EntityUpdate {
  upserted: ID[];
  deleted: ID[];
}

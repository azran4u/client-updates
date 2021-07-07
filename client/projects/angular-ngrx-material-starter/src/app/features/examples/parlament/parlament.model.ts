export type ID = string;

export interface Operation {
  id: ID;
  name: string;
  mos: Mo['id'][];
}

export interface Mo {
  id: ID;
  name: string;  
  areas: Area['id'][];
}

export interface Area {
  id: ID;
  name: string;  
}




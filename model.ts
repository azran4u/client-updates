export interface Entity {
  id: string;
  name: string;
}
export interface MinimalOperation extends Entity {}

export interface ShallowOperation extends MinimalOperation {
  targetsIds: string[];
  attackIds: string[];
}

export interface Target extends Entity {
  plansIds: string[];
}

export interface Plan extends Entity {}

interface AirEvent {
  id: string;
  name: string;
  from: Date;
  to: Date;
  structuresIds: string[];
}

interface Structure {
  id: string;
  name: string;
  missionOrderIds: string[];
}

interface MissionOrder {
  id: string;
  name: string;
}

// start with initial AirEvents state equal to empty array
// subscribe to all AirEvents (shallow) by time range
// for every update -
//      1. deep equal the result native fields (id, name, from, to) with current state
//          update the store with changes
//          deep equal is needed to avoid unnecessary rendering (immutable store)
//      2. deep equal the result linked entities ids array (structuresIds) with current state
//          scenario 1 - a new structure is on the list
//          scenario 2 - a structure has removed from the list
//              In either case do the following
//                  create three arrays of ids - current, added, deleted
//                  remove deleted entities from store and remove them from current
//                  merge current structures with the added ones and subscribe to structureChangesByIds (cancel the previous one)
//                  query by id the added entities and update the store
//                  for every updated structure
//
//          Note - an updated structure will not trigger a change on AirEvent (it WILL trigger event on the structures subscription)

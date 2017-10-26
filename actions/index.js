export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES'
export const ADD_ENTRY = 'ADD_ENTRY'


//fetch all of the days from calendar from database
export function receiveEntries (entries) {
  return {
    type: RECEIVE_ENTRIES,
    entries,
  }
}

export function addEntry (entry) {
  return {
    type: ADD_ENTRY,
    entry,
  }
}
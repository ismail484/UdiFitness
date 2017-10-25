import { AsyncStorage } from 'react-native'
import { CALENDAR_STORAGE_KEY ,formatCalendarResults} from './_calendar'


export function fetchCalendarResults () {
  //get all items which are living on CALENDAR_STORAGE_KEY
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
  //then format the results
    .then(formatCalendarResults)
}



//specific entry and key
export function submitEntry ({ entry, key }) {
  return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
      //key:prperty key of specific key,entry:value
    [key]: entry
  }))
}

//remove item at that key
export function removeEntry (key) {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
    .then((results) => {
      const data = JSON.parse(results)
      data[key] = undefined
      delete data[key]
      //data after remove specific key
      AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data))
    })
}
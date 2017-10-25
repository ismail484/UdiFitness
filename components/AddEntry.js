import React, { Component } from 'react'
import { View, TouchableOpacity, Text,Platform ,StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString ,getDailyReminderValue,
  clearLocalNotification,setLocalNotification} from '../utils/helpers'
import Slider from './Slider'
import Steppers from './Steppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { purple, white } from '../utils/colors'

//for navigation
import { NavigationActions } from 'react-navigation'



//take the onPress method
function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.AndroidSubmitBtn}
      onPress={onPress}>
        <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

 class AddEntry extends Component {

state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  //when we pass any metric(first three metric)
  increment = (metric) => {
      //we destructive this two properties only from this function of specific metirc
    const { max, step } = getMetricMetaInfo(metric)
 //we pass the current state but for specific metric we add the step
    this.setState((state) => {
      const count = state[metric] + step
 //return the same state but at the specific metric check the condition not to o
      return {
        ...state,
        //whatever the metric what we want to update 
        [metric]: count > max ? max : count,
      }
    })
  }
  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      }
    })
  }
  //this is for sleep and eat
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }
  //this function return date and all states
submit = () => {
    const key = timeToString()
    //grab all keys in the state:run bike...
    const entry = this.state

    // Update Redux
    this.props.dispatch(addEntry({
      [key]: entry
    }))

   //reset all values to zero
    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))

    // Navigate to home
 this.toHome()

    // Save to "DB"
    submitEntry({ key, entry })

    // Clear local notification
    //we clear notification when user entered the data then 
    //invoke another one for tomorrow
    clearLocalNotification()
      .then(setLocalNotification)
  }


reset = () => {
  //grab the day in the key
    const key = timeToString()

    // Update Redux
    this.props.dispatch(addEntry({
      //that means I haven't logged any data
      [key]: getDailyReminderValue()
    }))

     // Route to Home
 this.toHome()

    // Update "DB"
    removeEntry(key)

  }
   // back to Home function
toHome = () => {
  //goback from route that has  the key of AddEntry
    this.props.navigation.dispatch(NavigationActions.back({key: 'AddEntry'}))
  }

 render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View  style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today.</Text>
          <TextButton style={{padding: 10}} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        {//it return array with five properties
          Object.keys(metaInfo).map((key) => {
         // <Text>{JSON.stringify(this.state)}</Text>
          //we grab everythin at the specific key/metric
          const { getIcon, type, ...rest } = metaInfo[key]
          //state of specific key which is run, swim,...
          const value = this.state[key]

          return (
            //beacuse we used map tha's why we should put key
            <View key={key} style={styles.row}>
              {//this woll render getIcon of all keys
                getIcon()}
              {type === 'slider'
                ? <Slider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <Steppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />}
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  AndroidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
})


function mapStateToProps (state) {
  const key = timeToString()

  return {
    //if state at specific key and the state at the key of today is undefinded 
    //because if it was defined ..that means:  today: "👋 Don't forget to log your data today!"
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(
  mapStateToProps
)(AddEntry)
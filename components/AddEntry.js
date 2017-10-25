import React, { Component } from 'react'
import { View, TouchableOpacity, Text} from 'react-native'
import { getMetricMetaInfo,timeToString  } from '../utils/helpers'
import Slider from './Slider'
import Steppers from './Steppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'


function SubmitBtn ({ onPress }) {
   return (
     <TouchableOpacity
       onPress={onPress}>
         <Text>SUBMIT</Text>
     </TouchableOpacity>
   )
 }
 



export default class AddEntry extends Component {
    state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        //whatever metric is , we need to update it
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
  //for sleep and eat
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }

  //grab the key for specific day
submit = () => {
     const key = timeToString()
     const entry = this.state

     // Update Redux
 
    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))
 
     // Navigate to home
 
     // Save to "DB"
 
     // Clear local notification
   }

reset=()=>{
  const key=timeToString()

// Update Redux
 
    
 
     // Navigate to home
 
     // Save to "DB"
 
     // Clear local notification


}

  render() {
        const metaInfo = getMetricMetaInfo()

if (this.props.alreadyLogged) {
       return (
         <View>
           <Ionicons
            name={'ios-happy-outline'}
             size={100}
           />
           <Text>You already logged your information for today.</Text>
           <TextButton onPress={this.reset}>
             Reset
           </TextButton>
         </View>
       )
     }


return (
      <View>
          {/* <DateHeader date={(new Date()).toLocaleDateString()}/>   */}
        {/* return array with five property swim ,eat.run.. */}
        {Object.keys(metaInfo).map((key) => {
          //we grap all property from a specific key , the key is run or eat ,..
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key}>
              {getIcon()}
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
                  <SubmitBtn onPress={this.submit} />
            </View>
          )
        })}
      </View>
    )
  }
}

 

import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
//timeToString:to get id of the current day
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import MetricCard from './MetricCard'
import { white } from '../utils/helpers'
//add reset for specific entry
import TextButton from './TextButton'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'

//parent is History.js
//we just fomeat the date to appear on Header


class EntryDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const { entryId } = navigation.state.params

    const year = entryId.slice(0, 4)
    const month = entryId.slice(5,7)
    const day = entryId.slice(8)

    return {
      title: `${month}/${day}/${year}`
    }
  }

reset = () => {
    const { remove, goBack, entryId } = this.props

    remove()
    goBack()
    //invoke api
    removeEntry(entryId)
  }
//if we hit reset,  metrics: state[entryId], will be null 
shouldComponentUpdate (nextProps) {
    //don't render this component if this condition will not ocuurs
    return nextProps.metrics !== null && !nextProps.metrics.today
  }
  render() {
    const { metrics } = this.props

    return (
    //to show the metric card of five ativities
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <TextButton style={{margin: 20}} onPress={this.reset}>
          RESET
        </TextButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
})

function mapDispatchToProps (dispatch, { navigation }) {
  const { entryId } = navigation.state.params

  return {
    remove: () => dispatch(addEntry({
      [entryId]: timeToString() === entryId
        ? getDailyReminderValue()
        : null
    })),
    goBack: () => navigation.goBack(),
  }
}





//navigation is a current props
function mapStateToProps (state, { navigation }) {
    //entryId :key of the specific day
  const { entryId } = navigation.state.params

  return {
    entryId,
    //metrci:specific info at that [entryId]
    metrics: state[entryId],
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EntryDetail)
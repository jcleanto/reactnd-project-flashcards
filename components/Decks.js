import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchDecks } from '../utils/api'
import { receiveDecks } from '../actions'
import { View, Text, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { white, orange, darkGray } from '../utils/colors'

function Deck ({ title, questions }) {
  return (
    <View style={styles.item} key={title}>
      <Text style={{fontSize:26, color:white}}>{title}</Text>
      <Text style={{color:orange}}>{questions.length} cards</Text>
    </View>
  )
}

class Decks extends Component {
  state = {
    ready: false
  }

  componentDidMount() {
    const { dispatch } = this.props
    /*fetchDecks()
      .then(decks => dispatch(receiveDecks(decks)))
      .then(() => this.setState(() => ({ready: true})))*/
    const decksTest = {
      React: {
        title: 'React',
        questions: [
          {
            question: 'What is React?',
            answer: 'A library for managing user interfaces'
          },
          {
            question: 'Where do you make Ajax requests in React?',
            answer: 'The componentDidMount lifecycle event'
          }
        ]
      },
      JavaScript: {
        title: 'JavaScript',
        questions: [
          {
            question: 'What is a closure?',
            answer: 'The combination of a function and the lexical environment within which that function was declared.'
          }
        ]
      }
    };
    dispatch(receiveDecks(decksTest));
  }

  renderItem = ({item}, key) => {
    return (
      <TouchableOpacity
            onPress={() => this.props.navigation.navigate(
              'DeckDetail',
              { deckId: item.title }
            )}>
        <Deck key={item.title} title={item.title} questions={item.questions} />
      </TouchableOpacity>
    )
  }

  render () {
    const { decks } = this.props

    const arrOfDecks = [];
    decks && Object.keys(decks).map(key => {
      arrOfDecks.push(decks[key]);
    });

    return (
      <View style={{flex:1}}>
        <FlatList
          data={arrOfDecks}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: darkGray,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 1,
    shadowOpacity: 0.2,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 1
    },
  }
})

function mapStateToProps (decks) {
  return {
    decks
  }
}

export default connect(
  mapStateToProps,
)(Decks)
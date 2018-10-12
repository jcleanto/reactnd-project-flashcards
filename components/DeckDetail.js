import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { white, orange, darkGray, black } from '../utils/colors';

function AddCardBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios' ? styles.iosAddCardBtn : styles.androidAddCardBtn
      }
      onPress={onPress}>
      <Text style={styles.addCardBtnText}>Add Card</Text>
    </TouchableOpacity>
  );
}

function StartQuizBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios' ? styles.iosStartQuizBtn : styles.androidStartQuizBtn
      }
      onPress={onPress}>
      <Text style={styles.startQuizBtnText}>Start Quiz</Text>
    </TouchableOpacity>
  );
}

class DeckDetail extends Component {
  state = {
    title: '',
    questions: [],
  };

  static navigationOptions = ({ navigation }) => {
    const { deckId } = navigation.state.params;
    return {
      title: deckId,
    };
  };

  render() {
    const { deckId, deck } = this.props;

    return (
      <View style={styles.detail}>
        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 46, color: white }}>{deck.title}</Text>
          <Text style={{ fontSize: 18, color: orange }}>
            {deck.questions.length} cards
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <AddCardBtn onPress={() => this.props.navigation.navigate(
              'AddCard',
              { deckId: deckId }
            )} />
          <View style={{height:20}} />
          <StartQuizBtn onPress={() => this.props.navigation.navigate(
              'Quiz',
              { deckId: deckId }
            )} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkGray,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    marginBottom: 17,
    shadowRadius: 1,
    shadowOpacity: 0.2,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  iosAddCardBtn: {
    backgroundColor: white,
    padding: 10,
    borderColor: black,  
    borderRadius: 7,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidAddCardBtn: {
    backgroundColor: white,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardBtnText: {
    color: black,
    fontSize: 22,
    textAlign: 'center',
  },
  iosStartQuizBtn: {
    backgroundColor: black,
    padding: 10,
    borderColor: black,  
    borderRadius: 7,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidStartQuizBtn: {
    backgroundColor: white,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startQuizBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
});

function mapStateToProps(state, { navigation }) {
  const { deckId } = navigation.state.params;

  return {
    deckId,
    deck: state[deckId],
  };
}

export default connect(mapStateToProps)(DeckDetail);

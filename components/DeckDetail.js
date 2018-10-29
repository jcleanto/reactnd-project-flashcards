import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import {
  white,
  orange,
  darkGray,
  black,
  aliceBlue,
  borderAliceBlue,
  mediumGray,
  gainsbroGray,
  lightBlue,
} from '../utils/colors';

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

function StartQuizBtn({ onPress, disabled }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios'
          ? styles.iosStartQuizBtn
          : styles.androidStartQuizBtn
      }
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.startQuizBtnText}>Start a Quiz</Text>
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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <View style={styles.detail}>
          <View
            style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 46, color: mediumGray, fontWeight: 'bold' }}>
              {deck.title}
            </Text>
            <Text style={{ fontSize: 28, color: gainsbroGray }}>
              {deck.questions.length} cards
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <AddCardBtn
              onPress={() =>
                this.props.navigation.navigate('AddCard', { deckId: deckId })
              }
            />
            <View style={{ height: 20 }} />
            <StartQuizBtn
              disabled={deck.questions.length === 0}
              onPress={() =>
                this.props.navigation.navigate('Quiz', { deckId: deckId })
              }
            />
          </View>
        </View>
      </ScrollView>  
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: aliceBlue,
    borderRadius: 2,
    borderColor: borderAliceBlue,
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
    borderRadius: 30,
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
    borderRadius: 30,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardBtnText: {
    color: lightBlue,
    fontSize: 22,
    textAlign: 'center',
    width: 200
  },
  iosStartQuizBtn: {
    backgroundColor: lightBlue,
    padding: 10,
    borderColor: black,
    borderRadius: 30,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidStartQuizBtn: {
    backgroundColor: lightBlue,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 30,
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

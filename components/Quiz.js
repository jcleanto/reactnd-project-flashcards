import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  white,
  green,
  red,
  orange,
  darkGray,
  black,
  gray,
  aliceBlue,
  mediumGray,
  mediumGreen,
  indianRed,
  lightBlue,
  borderAliceBlue,
} from '../utils/colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import {
  clearLocalNotification,
  setLocalNotification
} from '../utils/helpers'

function CorrectAnswerBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios'
          ? styles.iosCorrectAnswerBtn
          : styles.androidCorrectAnswerBtn
      }
      onPress={onPress}>
      <Text style={styles.btnText}>Correct</Text>
    </TouchableOpacity>
  );
}

function IncorrectAnswerBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios'
          ? styles.iosIncorrectAnswerBtn
          : styles.androidIncorrectAnswerBtn
      }
      onPress={onPress}>
      <Text style={styles.btnText}>Incorrect</Text>
    </TouchableOpacity>
  );
}

function BackDeckBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios' ? styles.iosBackDeckBtn : styles.androidBackDeckBtn
      }
      onPress={onPress}>
      <Text style={styles.backDeckBtnText}>Back to Deck</Text>
    </TouchableOpacity>
  );
}

function RestartQuizBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios'
          ? styles.iosRestartQuizBtn
          : styles.androidRestartQuizBtn
      }
      onPress={onPress}>
      <Text style={styles.restartQuizBtnText}>Restart Quiz</Text>
    </TouchableOpacity>
  );
}

class Quiz extends Component {
  state = {
    question: '',
    answer: '',
    questions: [...this.props.deck.questions],
    finished: false,
    flipped: false,
    numberOfCorrects: 0,
    questionIndex: 0,
  };

  static navigationOptions = ({ navigation }) => {
    const { deckId } = navigation.state.params;
    return {
      title: 'Quiz',
    };
  };

  componentDidMount() {
    this.shiftQuestions();
  }

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
  }

  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
    }
    this.setState({
      flipped: !this.state.flipped,
    });
  }

  shiftQuestions = () => {
    //const { questions } = this.state;
    const arrQuestions = this.state.questions;
    let item = arrQuestions.shift();
    if (item !== undefined) {
      this.setState({
        question: item.question,
        answer: item.answer,
        questions: arrQuestions,
        questionIndex: ++this.state.questionIndex,
        finished: false,
      });
    } else {
      this.setState({
        question: '',
        answer: '',
        finished: true,
        questionIndex: 0,
      });
      clearLocalNotification()
        .then(setLocalNotification);
    }
  };

  restartQuiz = () => {
    const arrQuestions = [...this.props.deck.questions];
    let item = arrQuestions.shift();
    this.setState({
      question: item.question,
      answer: item.answer,
      questions: arrQuestions,
      finished: false,    
      //flipped: false,
      questionIndex: 1,
      numberOfCorrects: 0,
    });
  }

  answer = type => {
    if (type === 'correct') {
      this.setState({
        numberOfCorrects: ++this.state.numberOfCorrects,
      });
    }
    this.shiftQuestions();
  };

  render() {
    const { deckId, deck } = this.props;
    const {
      question,
      answer,
      flipped,
      questionIndex,
      finished,
      numberOfCorrects,
    } = this.state;

    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }],
    };
    const backAnimatedStyle = {
      transform: [{ rotateY: this.backInterpolate }],
    };

    const flipText = flipped ? 'Question' : 'Answer';

    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        {!finished && (
          <View style={styles.detail}>
            <View style={{ flex: 3 }}>
              <View>
                <Text style={{ color: mediumGray }}>
                  {questionIndex}/{deck.questions.length}
                </Text>
              </View>
              <View
                style={{
                  flex: 3,
                  alignItems: 'stretch',
                  justifyContent: 'stretch',
                }}>
                <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                  <Text style={{ fontSize: 46, color: mediumGray }}>{question}</Text>
                </Animated.View>
                <Animated.View
                  style={[
                    backAnimatedStyle,
                    styles.flipCard,
                    styles.flipCardBack,
                  ]}>
                  <Text style={{ fontSize: 36, color: mediumGray }}>{answer}</Text>
                </Animated.View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <TouchableOpacity onPress={() => this.flipCard()}>
                  <Text
                    style={{ color: indianRed, fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>
                    Show {flipText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <CorrectAnswerBtn onPress={() => this.answer('correct')} />
              <View style={{ height: 20 }} />
              <IncorrectAnswerBtn onPress={() => this.answer('incorrect')} />
            </View>
          </View>
        )}
        {finished && (
          <View
            style={[
              styles.detailScore,
              { alignItems: 'center', alignContent: 'center' },
            ]}>
            <FontAwesome name="handshake-o" size={130} color={darkGray} />
            {numberOfCorrects === deck.questions.length && (
              <Text style={{ fontSize: 36, textAlign: 'center' }}>
                Congratulations your score is:
              </Text>
            )}
            {numberOfCorrects !== deck.questions.length && (
              <Text style={{ fontSize: 36, textAlign: 'center' }}>
                Nice your score is:
              </Text>
            )}
            <Text style={{ fontSize: 126, color: orange }}>
              {numberOfCorrects}
            </Text>
            <View style={{ flex: 1 }}>
              <BackDeckBtn
                onPress={() =>
                  this.props.navigation.goBack()
                }
              />
              <View style={{ height: 20 }} />
              <RestartQuizBtn
                onPress={
                  this.restartQuiz
                }
              />
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
  },
  detailScore: {
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
  iosCorrectAnswerBtn: {
    backgroundColor: mediumGreen,
    padding: 10,
    borderColor: black,
    borderRadius: 30,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidCorrectAnswerBtn: {
    backgroundColor: mediumGreen,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 30,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  iosIncorrectAnswerBtn: {
    backgroundColor: indianRed,
    padding: 10,
    borderColor: black,
    borderRadius: 30,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidIncorrectAnswerBtn: {
    backgroundColor: indianRed,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 30,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipCard: {
    flex: 1,
    padding: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: aliceBlue,
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    backgroundColor: aliceBlue,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  iosBackDeckBtn: {
    backgroundColor: white,
    padding: 10,
    borderColor: black,
    borderRadius: 30,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidBackDeckBtn: {
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
  backDeckBtnText: {
    color: lightBlue,
    fontSize: 22,
    textAlign: 'center',
    width: 200
  },
  iosRestartQuizBtn: {
    backgroundColor: lightBlue,
    padding: 10,
    borderColor: black,
    borderRadius: 30,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidRestartQuizBtn: {
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
  restartQuizBtnText: {
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

export default connect(mapStateToProps)(Quiz);

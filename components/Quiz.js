import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Animated,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { white, green, red, orange, darkGray, black, gray } from '../utils/colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons'

function CorrectAnswerBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios' ? styles.iosCorrectAnswerBtn : styles.androidCorrectAnswerBtn
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
        Platform.OS === 'ios' ? styles.iosIncorrectAnswerBtn : styles.androidIncorrectAnswerBtn
      }
      onPress={onPress}>
      <Text style={styles.btnText}>Incorrect</Text>
    </TouchableOpacity>
  );
}

class Quiz extends Component {
  state = {
    question: '',
    answer: '',
    questions: this.props.deck.questions,   
    finished: false,
    flipped: false,
    numberOfCorrects: 0,
    questionIndex: 0
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
    })
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    })
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    })
  }

  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue,{
        toValue: 0,
        friction: 8,
        tension: 10
      }).start();
    } else {
      Animated.spring(this.animatedValue,{
        toValue: 180,
        friction: 8,
        tension: 10
      }).start();
    }
    this.setState({
      flipped: !this.state.flipped
    });    
  }

  shiftQuestions = () => {
    const { questions } = this.state;
    const arrQuestions = [...questions];
    let item = arrQuestions.shift();
    if (item !== undefined) {
      this.setState({
        question: item.question,
        answer: item.answer,
        questions: arrQuestions,
        questionIndex: ++this.state.questionIndex
      });
    } else {
      this.setState({
        question: '',
        answer: '',
        finished: true,
        questionIndex: 0,
      });
    }
  }

  answer = (type) => {
    if (type === 'correct') {
      this.setState({
        numberOfCorrects: ++this.state.numberOfCorrects
      });
    }
    this.shiftQuestions();
  }

  render() {
    const { deckId, deck } = this.props;
    const { question, answer, flipped, questionIndex, finished, numberOfCorrects } = this.state;

    const frontAnimatedStyle = {
      transform: [
        { rotateY: this.frontInterpolate}
      ]
    }
    const backAnimatedStyle = {
      transform: [
        { rotateY: this.backInterpolate }
      ]
    }

    const flipText = (flipped)?'Question':'Answer';

    return (
      
      <ScrollView style={{flex:1}} contentContainerStyle={{flex:1}}>
        {!finished &&
        <View style={styles.detail}>
          <View style={{ flex:3 }}>
            <View style={{flex:3, alignItems: 'stretch', justifyContent:'stretch'}}>
              <View>
                <Text style={{color: darkGray}}>{questionIndex}/{deck.questions.length}</Text>
              </View>
              <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                <Text style={{ fontSize: 46, color: white }}>{question}</Text>
              </Animated.View>
              <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
                <Text style={{ fontSize: 36, color: white }}>{answer}</Text>
              </Animated.View>
            </View>
            <View style={{flex:1, justifyContent:'center', alignContent:'center'}}>
              <TouchableOpacity onPress={() => this.flipCard()}>
                <Text style={{color:red, fontWeight:'bold', fontSize:22}}>{flipText}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <CorrectAnswerBtn onPress={() => this.answer('correct')}/>
            <View style={{height:20}} />
            <IncorrectAnswerBtn onPress={() => this.answer('incorrect')} />
          </View>
        </View>
        }
        {finished && 
          <View style={[styles.detail, {alignItems:'center', alignContent:'center'}]}>
            <FontAwesome name='handshake-o' size={130} color={darkGray} />
            {numberOfCorrects === deck.questions.length && 
              <Text style={{fontSize:36, textAlign:'center'}}>Congratulations your score is:</Text>
            }
            {numberOfCorrects !== deck.questions.length && 
              <Text style={{fontSize:36, textAlign:'center'}}>Nice your score is:</Text>
            }
            <Text style={{fontSize:166, color:orange}}>{numberOfCorrects}</Text>  
          </View>        
        }
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
  iosCorrectAnswerBtn: {
    backgroundColor: green,
    padding: 10,
    borderColor: black,  
    borderRadius: 7,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidCorrectAnswerBtn: {
    backgroundColor: green,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
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
    backgroundColor: red,
    padding: 10,
    borderColor: black,  
    borderRadius: 7,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidIncorrectAnswerBtn: {
    backgroundColor: red,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipCard: {
    flex: 1,
    padding: 10,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gray,
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    backgroundColor: gray,
    position: 'absolute',
    width:'100%',
    height:'100%'
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


import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  View,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { darkGray } from '../utils/colors';
import { FormErrors } from './FormErrors';
import { SubmitButton } from './SubmitButton';
import { addCard } from '../actions';
import { NavigationActions } from 'react-navigation';
import { submitCard } from '../utils/api';

class AddCard extends Component {
  state = {
    question: '',
    answer: '',
    formErrors: { question: '', answer: '' },
    questionValid: false,
    answerValid: false,
    formValid: false
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let questionValid = this.state.questionValid;
    let answerValid = this.state.answerValid;
    switch (fieldName) {
      case 'question':
        questionValid = value.length >= 3;
        fieldValidationErrors.question = questionValid
          ? ''
          : ' should be at least 3 characters long.';
        break;
      case 'answer':
        answerValid = value.length >= 3;
        fieldValidationErrors.answer = answerValid
          ? ''
          : ' should be at least 3 characters long.';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      questionValid: questionValid,
      answerValid: answerValid,
    });
  }

  onInputChange = input => {
    const { name, value } = input;
    this.setState(
      {
        ...this.state,
        [input.name]: value,
      },
      () => {
        this.validateField(name, value);
      }
    );
  };

  validateForm() {
    this.setState({
      formValid: this.state.questionValid && this.state.answerValid,
    });
  }

  onSubmit = () => {
    const { question, answer } = this.state;
    const { deckId, deck } = this.props;
    const key = deck.title;
    const card = {
      question: question,
      answer: answer,
    };

    const arrQuestions = deck.questions;
    arrQuestions.push(card);

    this.props.dispatch(
      addCard({
        [deckId]: { ...deck },
      })
    );

    this.setState(() => ({
      question: '',
      answer: '',
      formErrors: { question: '', answer: '' },
      questionValid: false,
      answerValid: false,
    }));

    Keyboard.dismiss();

    this.toHome();

    submitCard({ key, deck });
  };

  toHome = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { question, answer, answerValid, questionValid } = this.state;
    const { deck } = this.props;

    return (
      <KeyboardAvoidingView style={styles.scrollView}>
        <ScrollView style={styles.inputView}>
          <Text style={styles.text}>Question</Text>
          <TextInput
            name="question"
            value={question}
            onChangeText={value =>
              this.onInputChange({ name: 'question', value: value })
            }
            style={styles.inputText}
            blurOnSubmit={true}
          />
          <Text style={styles.text}>Answer</Text>
          <TextInput
            name="answer"
            value={answer}
            onChangeText={value =>
              this.onInputChange({ name: 'answer', value: value })
            }
            style={styles.inputText}
            blurOnSubmit={true}
          />
          <FormErrors formErrors={this.state.formErrors} />
          <View style={{ height: 10 }} />
          <SubmitButton
            onPress={this.onSubmit}
            disabled={!answerValid || !questionValid}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  inputView: {
    flex: 1,
    padding: 10,
  },
  inputText: {
    fontSize: 32,
    borderRadius: 6,
    borderColor: darkGray,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  text: {
    fontSize: 20,
    marginLeft: 10,
  },
});

function mapStateToProps(state, { navigation }) {
  const { deckId } = navigation.state.params;

  return {
    deckId,
    deck: state[deckId],
  };
}

export default connect(mapStateToProps)(AddCard);

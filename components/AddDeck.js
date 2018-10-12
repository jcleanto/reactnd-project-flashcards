import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  View,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { darkGray } from '../utils/colors';
import { FormErrors } from './FormErrors'
import { SubmitButton } from './SubmitButton'
import { addDeck } from '../actions'
import { NavigationActions } from 'react-navigation'
import { submitDeck } from '../utils/api'

class AddDeck extends Component {
  state = {
    title: '',
    formErrors: { title: '' },
    titleValid: false,
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let titleValid = this.state.titleValid;
    const reg = /^[A-Za-z]+$/;
    titleValid = reg.test(value) && value.length >= 3;
    fieldValidationErrors.title = titleValid ? '' : ' should be only letters, without spaces, without special characters and at least 3 characters long.';
    this.setState({
      formErrors: fieldValidationErrors,
      titleValid: titleValid,
    });
  }

  onInputChange = input => {
    const value = input.title;
    this.setState(
      {
        ...this.state,
        ...input,
      },
      () => {
        this.validateField('Title', value);
      }
    );
  };

  onSubmit = () => {
    const { title } = this.state;
    const key = title
    const deck = {
      [title]: {
        title,
        questions: [],
        numberOfCorrectAnswers: 0
      }
    }

    this.props.dispatch(addDeck({
      ...deck
    }));

    this.setState(() => ({ title: '', formErrors: { title: '' }, titleValid: false }));

    Keyboard.dismiss();

    this.toHome();

    submitDeck({ key, deck });

  }

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({key: 'AddDeck'}))
  }

  render() {
    const { title, titleValid } = this.state;

    return (
      <KeyboardAvoidingView style={styles.scrollView}>
        <View style={styles.inputView}>
          <Text style={styles.text}>Title</Text>
          <TextInput
            name="title"
            value={title}
            onChangeText={value => this.onInputChange({ title: value })}
            style={styles.inputText}
            maxLength={30}
            blurOnSubmit={true}
          />
          <FormErrors formErrors={this.state.formErrors} />
          <View style={{ height: 10 }} />
          <SubmitButton onPress={this.onSubmit} disabled={!titleValid} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
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
    padding: 10
  },
  text: {
    fontSize: 20,
    marginLeft: 10
  }
});

export default connect()(AddDeck);

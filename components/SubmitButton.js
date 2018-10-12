import React from 'react';
import { TouchableOpacity, Platform, Text, StyleSheet } from 'react-native';
import { darkGray, black, white } from '../utils/colors'

const styles = StyleSheet.create({
  iosSubmitButton: {
    backgroundColor: darkGray,
    padding: 10,
    borderColor: darkGray,  
    borderRadius: 7,
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },
  androidSubmitButton: {
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
  submitButtonText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
});

export const SubmitButton = ({ onPress, disabled }) => (
  <TouchableOpacity
    style={
      Platform.OS === 'ios'
        ? styles.iosSubmitButton
        : styles.androidSubmitButton
    }
    onPress={onPress}
    disabled={disabled}>
    <Text style={styles.submitButtonText}>Submit</Text>
  </TouchableOpacity>
);
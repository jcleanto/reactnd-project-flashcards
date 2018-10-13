import React from 'react';
import { View, Text } from 'react-native'

export const FormErrors = ({ formErrors }) => (
  <View style={{justifyContent: 'center'}}>
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        return (
          <Text style={{color: 'red', textAlign: 'center'}} key={i}>
            {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} {formErrors[fieldName]}
          </Text>
        );
      } else {
        return '';
      }
    })}
  </View>
);

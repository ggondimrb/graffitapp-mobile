import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// import { Container } from './styles';

export default function ErrorMessage({errorValue}) {
  if (!errorValue) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{errorValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 25,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
});

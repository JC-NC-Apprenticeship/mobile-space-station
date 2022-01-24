import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DiagnosticsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>There is no new screen to build for this section</Text>
      <Text style={styles.body}>Please check src/stage-06/README.md for further instructions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
    marginTop: -32,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
});

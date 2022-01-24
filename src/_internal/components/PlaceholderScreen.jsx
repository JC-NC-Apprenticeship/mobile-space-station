import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

/**
 * This value is defined in app.config.json
 */
const docsHost = Constants?.manifest?.extra?.docsHost;
/**
 * Displays helpful placeholder text for a given stage to hint to the student
 * where the documentation and code for the stage live, as well as linking to
 * the relevant demo app screen.
 */
export const PlaceholderScreen = ({ sourceFile, demoSourceFile, demoRoute, lessonLink }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.body}>
        Check out the lesson and, when you&apos;re ready, start editing {sourceFile}to update this screen.
      </Text>
      {demoSourceFile && (
        <Text style={styles.body}>The demo screen for this feature is available at {demoSourceFile}.</Text>
      )}

      <Button
        icon="file-document"
        mode="outlined"
        style={styles.button}
        onPress={() => Linking.openURL(`${docsHost}/${lessonLink}`)}
      >
        See the lesson for this stage
      </Button>

      {demoRoute && (
        <Button icon="cellphone-play" mode="outlined" onPress={() => navigation.navigate(demoRoute)}>
          See the demo app screen
        </Button>
      )}
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
  button: {
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
});

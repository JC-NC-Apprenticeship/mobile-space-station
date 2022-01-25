import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

import user from '../../assets/user.jpg';

export const OrientationScreen = () => {
  return (
    <View style={styles.mainDiv}>
      <Text style={styles.text}>Hello World!!</Text>
      <View style={styles.mainCard}>
        <Image
          style={styles.tinyLogo}
          source={user}
        />
        <View>
          <Title style={styles.cardText}>Just Coder</Title>
          <Paragraph style={styles.cardText}>Super Powers: None.....</Paragraph>
        </View>
      </View>
    </View>
    )


};
const styles = StyleSheet.create({
  mainDiv: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(0,25,51)',
  },
  text: {
    color: 'white',
    fontSize: 23,
    marginTop: 20,
  },

  mainCard: {
    flex: 0.25,
    flexDirection: "row",
    width: 350,
    justifyContent: 'space-around',
    // alignContent: 'center',
    alignItems: 'center',


    backgroundColor: 'rgb(2, 62, 138)',
    borderRadius: 15,
    marginTop: 20,
    borderColor: "rgb(0, 150, 199)",
    borderWidth: 5,
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderColor: "rgb(0, 150, 199)",
    borderWidth: 3,
  },
  cardText: {
    color: 'white',
  }
});

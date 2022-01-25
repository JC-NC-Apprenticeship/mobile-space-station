import React from 'react';

import { SafeAreaView, Text, View, StyleSheet , FlatList, Pressable } from 'react-native';
import { Card } from 'react-native-paper';

// This is the data containing the crew members
import { names } from '../data/crew';

// This is our pre-built CachedImage component - feel free to take a look at the implementation
import { CachedImage } from '../third-party-components/CachedImage';

// Or any icon set you prefer!
//import { AntDesign } from '@expo/vector-icons';

const Item = ({ name }) => (
  <View>
    <Text style={styles.text}>{name}</Text>
  </View>
);


export const CrewManifestScreen = () => {
  const renderItem = ({ item }) => (
    <Item name={item.name} />
  );
  return (
    <SafeAreaView style={styles.mainDiv}>
      <FlatList
        data={names}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainDiv: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(0,25,51)',
  },
  text: {
    color: 'red',
    fontSize: 23,
    marginTop: 20,
  },  
});
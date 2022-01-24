import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, List } from 'react-native-paper';

import { Authenticated } from '../components/Authenticated';
import SaunaEntrance from '../../../assets/sauna-entrance.png';

/**
 * The top secret documents, protected by biometric authentication
 */
export const TopSecretDocumentsScreen = () => {
  const { goBack } = useNavigation();
  return (
    <View style={styles.container}>
      <Authenticated onCancel={() => goBack()}>
        <Card>
          <Card.Title title={'Private sauna access protocol'} />
          <Card.Cover source={SaunaEntrance} />
        </Card>

        <List.Item title="Turn the handle left three times" left={() => <List.Icon icon="numeric-1-box" />} />

        <List.Item title="Press the handle in" left={() => <List.Icon icon="numeric-2-box" />} />

        <List.Item title={`Shout "there's no WE in STEAM"`} left={() => <List.Icon icon="numeric-3-box" />} />

        <List.Item title="Enter and relax" left={() => <List.Icon icon="numeric-4-box" />} />
      </Authenticated>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginTop: 16,
  },
  cardContent: {
    flexDirection: 'row',
  },
});

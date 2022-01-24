import React from 'react';
import { ScrollView } from 'react-native';
import { Card } from 'react-native-paper';

import secretPlans from '../../../assets/bridge.jpg';
import canteenIcon from '../../../assets/canteen.jpg';
import crewIcon from '../../../assets/crew.jpg';
import distressIcon from '../../../assets/distress.jpg';
import inventoryIcon from '../../../assets/inventory.jpg';
import { Spacer } from '../components/Spacer';

const Dashboard = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} testID="dashboard-scrollview">
      <Card onPress={() => navigation.navigate('DemoAppCrewManifest')}>
        <Card.Cover source={crewIcon} />
        <Card.Title title="Crew Manifest" />
      </Card>
      <Spacer />
      <Card onPress={() => navigation.navigate('DemoAppInventory')}>
        <Card.Cover source={inventoryIcon} />
        <Card.Title title="Inventory" />
      </Card>
      <Spacer />
      <Card onPress={() => navigation.navigate('DemoAppTopSecretDocuments')}>
        <Card.Cover source={secretPlans} />
        <Card.Title title="Top Secret Plans" />
      </Card>
      <Spacer />
      <Card
        onPress={() => {
          navigation.navigate('DemoAppDistressCall');
        }}
      >
        <Card.Cover source={distressIcon} />
        <Card.Title title="Distress Calls" />
      </Card>
      <Spacer />
      <Card
        onPress={() => {
          navigation.navigate('DemoAppCanteen');
        }}
      >
        <Card.Cover source={canteenIcon} />
        <Card.Title title="Crew Canteen" />
      </Card>
    </ScrollView>
  );
};

export const DashboardScreen = ({ navigation }) => {
  return <Dashboard navigation={navigation} />;
};

import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { CanteenScreen } from './canteen';
import { CrewManifestScreen } from './crew-manifest';
import { DashboardScreen } from './dashboard';
import { DistressCallScreen } from './distress-call/DistressCall';
import { InventoryScreen } from './inventory';
import { TopSecretDocumentsScreen } from './top-secret-documents';

const Stack = createStackNavigator();

export const appRoutes = (notifications) => (
  <>
    <Stack.Screen name="DemoAppDashboard" component={DashboardScreen} options={{ title: 'Station 76' }} />
    <Stack.Screen name="DemoAppCrewManifest" component={CrewManifestScreen} options={{ title: 'Crew Manifest' }} />
    <Stack.Screen
      name="DemoAppTopSecretDocuments"
      component={TopSecretDocumentsScreen}
      options={{ title: 'Top Secret Documents' }}
    />
    <Stack.Screen
      name="DemoAppInventory"
      component={InventoryScreen}
      options={{
        title: 'Inventory',
      }}
    />
    <Stack.Screen
      name="DemoAppDistressCall"
      options={{
        title: 'Distress Calls',
      }}
    >
      {(props) => <DistressCallScreen {...props} notifications={notifications} />}
    </Stack.Screen>
    <Stack.Screen
      name="DemoAppCanteen"
      component={CanteenScreen}
      options={{
        title: 'Canteen',
      }}
    />
  </>
);

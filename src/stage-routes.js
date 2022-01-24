import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { OrientationScreen } from './stage-01/OrientationScreen';
import { CrewManifestScreen } from './stage-02/CrewManifestScreen';
import { InventoryScreen } from './stage-03/InventoryScreen';
import { KeepOutScreen } from './stage-04/KeepOutScreen';
import { DistressCallsScreen } from './stage-05/DistressCallsScreen';
import { DiagnosticsScreen } from './stage-06/DiagnosticsScreen';
import { CanteenScreen } from './stage-07/CanteenScreen';

const Stack = createStackNavigator();

export const stageRoutes = () => (
  <>
    <Stack.Screen name="Orientation" component={OrientationScreen} options={{ title: 'Orientation' }} />
    <Stack.Screen name="CrewManifest" component={CrewManifestScreen} options={{ title: 'Crew Manifest' }} />
    <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
    <Stack.Screen name="KeepOut" component={KeepOutScreen} options={{ title: 'Securing the Sauna' }} />
    <Stack.Screen name="DistressCalls" component={DistressCallsScreen} options={{ title: 'Comms Centre' }} />
    <Stack.Screen name="Diagnostics" component={DiagnosticsScreen} options={{ title: 'Diagnostics (E2E tests)' }} />
    <Stack.Screen name="Canteen" component={CanteenScreen} options={{ title: 'Canteen' }} />
  </>
);

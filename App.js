import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import { internalSetup } from './src/_internal/setup.js';
import { appRoutes } from './src/completed-app';
import { DistressCallsProvider, useDistressCalls } from './src/completed-app/hooks/UseDistressCalls';
import { useNotifications } from './src/completed-app/hooks/UseNotifications';
import { stageRoutes } from './src/stage-routes';

internalSetup();

const menu = [
  {
    title: 'Chapter 1: Orientation',
    icon: 'numeric-1-box',
    screen: 'Orientation',
  },
  {
    title: 'Chapter 2: Crew are you?',
    icon: 'numeric-2-box',
    screen: 'CrewManifest',
  },
  {
    title: 'Chapter 3: A well-stocked station',
    icon: 'numeric-3-box',
    screen: 'Inventory',
  },
  {
    title: 'Chapter 4: Bridge to security',
    icon: 'numeric-4-box',
    screen: 'KeepOut',
  },
  {
    title: 'Chapter 5: Incoming distress call, sir!',
    icon: 'numeric-5-box',
    screen: 'DistressCalls',
  },
  {
    title: 'Chapter 6: Run a level five diagnostic',
    icon: 'numeric-6-box',
    screen: 'Diagnostics',
  },
  {
    title: 'Chapter 7: Budget cuts!',
    icon: 'numeric-7-box',
    screen: 'Canteen',
  },
  {
    title: 'Demo app',
    icon: 'cellphone-play',
    screen: 'DemoAppDashboard',
  },
];

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <List.Section>
        {menu.map((section) => (
          <List.Item
            key={section.title}
            title={section.title}
            onPress={() => navigation.navigate(section.screen)}
            left={(props) => <List.Icon {...props} icon={section.icon} />}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
};

const Stack = createStackNavigator();

function App() {
  /**
   * Initialise our global notifications handler
   */
  const Notifications = useNotifications();
  const { setActiveDistressCallId } = useDistressCalls();

  return (
    <NavigationContainer
      /**
       * Here we set up handlers for custom URI schemes so we can support
       * "deep links" into screens within our app
       */
      linking={{
        prefixes: ['northcoders-mobile://'],
        config: {
          screens: {
            DemoAppDistressCall: 'DemoAppDistressCall',
          },
        },
        subscribe(listener) {
          const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            /**
             * This listener is already set up so that the demo app can receive
             * push notifications
             *
             * We've ensured that you can differentiate between notifications
             * intended for the demo app and for yours by only linking to the
             * demo distress call screen when the notification payload
             * contains `"demoApp": true true`.
             */
            if (response.notification.request.content.data.demoApp) {
              setActiveDistressCallId(response.notification.request.content.data.id);
              listener('northcoders-mobile://DemoAppDistressCall');
            }
          });

          /**
           * Unsubscribe from notifications if the app component unmounts - in
           * reality this isn't likely, but it's good practice nonetheless
           */
          return () => {
            subscription.remove();
          };
        },
      }}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Northcoders - Intro to Mobile' }} />
        {stageRoutes()}
        {appRoutes(Notifications)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppWithContext() {
  /**
   * We wrap the app in a provider which handles distress calls state. This
   * allows the distress calls screen to subscribe to updates to distress
   * calls. Otherwise the distress calls would only be refreshed when that
   * screen was mounted - i.e. the user would have to leave and revisit the
   * screen.
   */
  return (
    <DistressCallsProvider>
      <App />
    </DistressCallsProvider>
  );
}

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useDistressCalls } from '../hooks/UseDistressCalls';

/**
 * Set the config for handling notifications _while the app is open_.  We force
 * the notification UI to show, so that our distress call location acquisition
 * notifications show up, but we mute sounds and disabled "badges" - typically
 * numbered red circles displayed on an app icon - so that the experience isn't
 * too disruptive.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Helper to check whether permission for notifications has been granted, and
 * request it if not
 */
const isPermissionGranted = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

const registerForPushNotificationsAsync = async () => {
  /**
   * Simulators/emulators usually don't support push notifications - a quick
   * reminder here will save some head-scratching later!
   *
   * @see https://docs.expo.io/versions/latest/sdk/constants/#constantsisdevice
   */
  if (!Constants.isDevice) {
    console.log(
      'You are running the app on a simulator or emulator. If you want to test push notification functionality, run the app on a physical device.'
    );
    return;
  }

  /**
   * Handle a user denying permission to show notifications
   */
  if (!(await isPermissionGranted())) {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  /**
   * Android allows further customisation of notifications
   */
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

/**
 * This hook sets up a listener for notifications and passes their data to the
 * distress calls context provider
 */
export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
  const notifications = useRef();
  const { addDistressCall, setActiveDistressCallId } = useDistressCalls();

  notifications.current = Notifications;

  useEffect(() => {
    console.log('use notifications called!');

    (async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    })();

    notificationListener.current = Notifications.addNotificationReceivedListener(async (response) => {
      console.log('Notification received', response);
      const data = response.request.content.data;
      if (data.demoApp) addDistressCall(data);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      console.log('Notification response received: ', response);
      setActiveDistressCallId(response.notification.request.content.data.id);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [setActiveDistressCallId, addDistressCall]);

  const examplePayloadWithoutCoordinates = {
    id: '1',
    message: "That's no planet...",
    title: "Help me Obi Wan, you're our only hope",
    crewMember: 'Frank Gibson',
    coordinates: null,
    demoApp: true,
  };

  const examplePayloadWithCoordinates = {
    id: '1',
    coordinates: {
      x: 12312,
      y: 23123,
      z: 567456345,
    },
    demoApp: true,
  };

  if (expoPushToken) {
    console.log(`
Navigate to https://expo.io/notifications to dispatch push notifications
Your token is ${expoPushToken}
--------------------------------------------------------------------------------

Here is an example of a JSON payload you can send to store a new distress call (remove demoApp: true if you're intending to handle the notification in your app):

${JSON.stringify(examplePayloadWithoutCoordinates, undefined, 2)}

Here is a list of available crew members that have permission to dispatch distress calls:
Frank Gibson
Matt Koepp
Leonard Deckow II
Roy Dach
Brenda Aufderhar
Phil Heathcote MD
Monica Veum
Fannie Emard
Miss Brittany Koepp
Tara Larkin
--------------------------------------------------------------------------------
Here is an example of a JSON payload you can send to update the coordinates of an existing distress call.

The id should match the id of the distress call you wish to update (remove demoApp: true if you're intending to handle the notification in your app).

${JSON.stringify(examplePayloadWithCoordinates, undefined, 2)}
  `);
  }

  return notifications.current;
};

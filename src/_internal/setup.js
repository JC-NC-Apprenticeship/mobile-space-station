/**
 * This file sets up various niceities for the app to enhance the student
 * experience and deal with various idiosincracies of the Expo Go app
 */
import { LogBox } from 'react-native';

export function internalSetup() {
  /**
   * When hot-reloading, our app re-mounts and tries to hide the splash screen.
   * This results in an annoying "yellow box" warning telling us that the
   * splash has already been hidden, which isn't helpful.
   *
   * This call tells React Native not to display this warning in the UI.
   */
  LogBox.ignoreLogs([/Native splash screen is already hidden/]);
}

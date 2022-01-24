import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

/**
 * This storage key references the flag in storage that tells us whether the
 * user has successfully authenticated using biometric ID. We use a UUID that
 * changes between app launches so that the user is effectively "signed out"
 * whenever they close the app
 */
const BIOMETRIC_KEY = uuid();

export const useBiometrics = () => {
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [didCancelBiometrics, setDidCancelBiometrics] = useState(false);

  useEffect(() => {
    (async () => {
      const deviceSupportsBiometrics = await LocalAuthentication.hasHardwareAsync();
      const biometricsEnabled = await LocalAuthentication.isEnrolledAsync();

      setHasBiometrics(deviceSupportsBiometrics && biometricsEnabled);
      setIsLoading(true);
    })();
  }, [setHasBiometrics]);

  useEffect(() => {
    const authenticateUser = async () => {
      const isAlreadyAuthenticated = await SecureStore.getItemAsync(BIOMETRIC_KEY);

      if (isAlreadyAuthenticated) {
        setHasBiometrics(true);
        setIsLoading(true);
        setIsAuthenticated(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync();

      if (result.success) {
        await SecureStore.setItemAsync(BIOMETRIC_KEY, 'true');
        setIsAuthenticated(true);
      }

      if (result.error === 'user_cancel') {
        setDidCancelBiometrics(true);
      }
    };

    if (hasBiometrics) {
      authenticateUser();
    }
  }, [hasBiometrics]);

  return {
    hasBiometrics,
    isLoading,
    isAuthenticated,
    didCancelBiometrics,
  };
};

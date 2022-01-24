import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

import { useBiometrics } from '../../hooks/UseBiometrics';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Paragraph } from 'react-native-paper';

/**
 * During development, you can change the value of PIN_KEY below to reset to a
 * state where the user hasn't registered a pin.
 *
 * AUTHENTICATED_KEY is set to a new UUID on each app launch so that the user
 * is effectively signed whenever they close the app
 */
const PIN_KEY = 'PIN_1';
const AUTHENTICATED_KEY = uuid();

const styles = StyleSheet.create({
  form: {
    marginTop: 16,
    marginBottom: 16,
  },
  errors: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

const Register = ({ setHasRegistered }) => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (value1 !== value2) {
      return setError(true);
    }

    const encryptedPin = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value1);

    await SecureStore.setItemAsync(PIN_KEY, encryptedPin);
    await SecureStore.setItemAsync(AUTHENTICATED_KEY, 'true');
    setHasRegistered(true);
  };

  return (
    <View style={{ padding: 16 }}>
      <Card>
        <Card.Title title="There's a first time for everything" />
        <Card.Content>
          <Paragraph>Before you go any further, set up a PIN to secure the documents!</Paragraph>
        </Card.Content>
        <View style={styles.form}>
          <TextInput
            value={value1}
            onChangeText={(value) => {
              setError(false);
              setValue1(value);
            }}
            error={error}
            secureTextEntry={true}
            label="Please enter PIN"
            keyboardType="numeric"
          />
          <TextInput
            value={value2}
            secureTextEntry={true}
            error={error}
            onChangeText={(value) => {
              setError(false);
              setValue2(value);
            }}
            label="Please re-enter PIN"
            keyboardType="numeric"
          />
          {error && (
            <View style={styles.errors}>
              <Paragraph>The pins you entered do not match!</Paragraph>
            </View>
          )}
          <Button style={styles.button} disabled={!value1 || !value2} onPress={handleSubmit}>
            Register PIN
          </Button>
        </View>
      </Card>
    </View>
  );
};

const setUserAuthenticated = async (setAuthenticated) => {
  await SecureStore.setItemAsync(AUTHENTICATED_KEY, 'true');
  return setAuthenticated(true);
};

const SignIn = ({ setAuthenticated }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    const encryptedPin = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);

    if (encryptedPin === storedPin) {
      setUserAuthenticated(setAuthenticated);
    }

    setError(true);
  };

  return (
    <View style={{ padding: 16 }}>
      <Card>
        <Card.Title title="Restricted access!" />
        <Card.Content>
          <Paragraph>Please enter your secure PIN to continue…</Paragraph>
        </Card.Content>
        <View style={styles.form}>
          <TextInput
            value={pin}
            onChangeText={(value) => {
              setError(false);
              setPin(value);
            }}
            error={error}
            secureTextEntry={true}
            label="Please enter PIN"
            keyboardType="numeric"
          />
          {error && (
            <View style={styles.error}>
              <Paragraph>You have entered an invalid pin</Paragraph>
            </View>
          )}
          <Button style={styles.button} disabled={!pin} onPress={handleSubmit}>
            Continue
          </Button>
        </View>
      </Card>
    </View>
  );
};

export const Authenticated = ({ children, onCancel }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  const {
    hasBiometrics,
    isAuthenticated: isAuthenticatedWithBiometrics,
    isLoading,
    didCancelBiometrics,
  } = useBiometrics();

  const checkIfAuthenticated = useCallback(async () => {
    if (isAuthenticatedWithBiometrics) {
      setAuthenticated(true);
      return;
    }

    setAuthenticated(!!(await SecureStore.getItemAsync(AUTHENTICATED_KEY)));
  }, [isAuthenticatedWithBiometrics]);

  const checkIfRegistered = useCallback(async () => {
    setHasRegistered(!!(await SecureStore.getItemAsync(PIN_KEY)));
  }, []);

  useEffect(() => {
    checkIfRegistered();
    checkIfAuthenticated();
  }, [hasRegistered, checkIfRegistered, checkIfAuthenticated]);

  useEffect(() => {
    if (didCancelBiometrics && onCancel) onCancel();
  }, [didCancelBiometrics, onCancel]);

  if (!hasRegistered && !hasBiometrics && isLoading) {
    return <Register setHasRegistered={setHasRegistered} />;
  }

  if (!authenticated && !hasBiometrics && isLoading) {
    return <SignIn setAuthenticated={setAuthenticated} />;
  }

  if (authenticated) {
    return children;
  }

  return null;
};

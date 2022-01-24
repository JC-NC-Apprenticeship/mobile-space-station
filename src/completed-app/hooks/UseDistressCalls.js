import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_DISTRESS_CALL_KEY = 'test_13';
const DistressCallsContext = React.createContext();

export const DistressCallsProvider = ({ children }) => {
  const [distressCalls, setDistressCalls] = useState([]);
  /**
   * This id indicates the distress call that has just come in via a
   * notification. Used on the distress calls screen to scroll to the
   * new/updated distress call
   */
  const [activeDistressCallId, setActiveDistressCallId] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(PUSH_DISTRESS_CALL_KEY);
        setDistressCalls((dc) => JSON.parse(data) || dc);
      } catch (e) {
        console.log('error is: ', e);
      }
    })();
  }, []);

  async function addDistressCall(data) {
    const existingDistressCalls = JSON.parse(await AsyncStorage.getItem(PUSH_DISTRESS_CALL_KEY)) || [];

    let hasFoundMatchingDistressCall = false;
    const updatedDistressCalls = existingDistressCalls.map((distressCall) => {
      if (distressCall.id === data.id) {
        hasFoundMatchingDistressCall = true;
        return data;
      }
      return distressCall;
    });

    if (!hasFoundMatchingDistressCall) {
      updatedDistressCalls.push(data);
    }
    await AsyncStorage.setItem(
      PUSH_DISTRESS_CALL_KEY,
      JSON.stringify(existingDistressCalls.length ? updatedDistressCalls : [data])
    );

    setDistressCalls(existingDistressCalls.length ? updatedDistressCalls : [data]);
  }

  return (
    <DistressCallsContext.Provider
      value={{ addDistressCall, distressCalls, activeDistressCallId, setActiveDistressCallId }}
    >
      {children}
    </DistressCallsContext.Provider>
  );
};

export const useDistressCalls = () => {
  return useContext(DistressCallsContext);
};

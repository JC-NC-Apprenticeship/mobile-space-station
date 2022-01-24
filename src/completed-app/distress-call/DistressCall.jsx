import React, { useState, useRef, useEffect } from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import relax from '../../../assets/relax.png';
import { CachedImage } from '../../third-party-components/CachedImage';

import { useDistressCalls } from '../hooks/UseDistressCalls';
import { crewMembers } from './crewMembers';

/**
 * This value is defined in app.config.json
 */
const host = Constants?.manifest?.extra?.imageHost;

/**
 * We define fixed height cards for our FlatList so we can use scrollToIndex()
 * to scroll to the last updated distress call when a notification is pressed
 * @see https://reactnative.dev/docs/flatlist#scrolltoindex
 */
const CARD_HEIGHT = 155;

const styles = StyleSheet.create({
  distressCard: {
    marginBottom: 16,
  },
  distressCardHeading: {
    position: 'relative',
    paddingRight: 50,
  },
  distress: {
    padding: 16,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  fallbackView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackImage: {
    width: 200,
    opacity: 0.1,
  },
  avatar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    backgroundColor: 'rgb(98, 0, 238)',
    borderRadius: 24,
  },
});

/**
 * Shown when there are no distress calls yet made
 */
const FallbackView = () => (
  <View style={styles.fallbackView}>
    <Image source={relax} style={styles.fallbackImage} resizeMode="contain" />
    <Title>Relax!</Title>

    <Paragraph>No one is in trouble... yet!</Paragraph>
  </View>
);

/**
 * An individual distress call card
 */
const DistressCallCard = ({ title, message, image, coordinates, onPinpointPress, isPending }) => {
  return (
    <Card style={styles.distressCard}>
      <Card.Content>
        <View style={styles.distressCardHeading}>
          <Title>{title}</Title>
          <CachedImage source={image} style={styles.avatar} />
        </View>
        <Paragraph>{message}</Paragraph>
        {coordinates && (
          <>
            <Paragraph>X: {coordinates.x}</Paragraph>
            <Paragraph>Y: {coordinates.y}</Paragraph>
            <Paragraph>Z: {coordinates.z}</Paragraph>
          </>
        )}
      </Card.Content>
      {!coordinates && (
        <Card.Actions>
          <Button disabled={isPending} onPress={onPinpointPress}>
            {isPending ? 'Pinpointing...' : 'Pinpoint signal source'}
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

/**
 * The main distress calls screen
 */
export const DistressCallScreen = ({ notifications }) => {
  const { distressCalls, activeDistressCallId } = useDistressCalls();
  const [pendingDistressCalls, setPendingDistressCalls] = useState([]);
  /**
   * We keep a reference to the scroll view so we can later call scrollToEnd()
   * when a distress call comes in
   */
  const scrollViewRef = useRef(null);

  /**
   * Scroll to the end of the view when a new distress call comes in so the
   * latest one is visible
   */
  useEffect(() => {
    if (!activeDistressCallId) return;

    setTimeout(
      () =>
        scrollViewRef.current?.scrollToIndex({
          animated: true,
          index: distressCalls.findIndex((distressCall) => distressCall.id === activeDistressCallId),
        }),
      1000
    );
  }, [activeDistressCallId, distressCalls]);

  const scheduleLocalNotification = async (distressCall) => {
    await notifications.scheduleNotificationAsync({
      content: {
        title: `Coordinates for distress call ${distressCall.id} discovered!`,
        body: 'Check the distress call screen and get going!',
        data: {
          ...distressCall,
          coordinates: {
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
          },
        },
      },
      trigger: { seconds: 5 },
    });
  };

  return distressCalls.length ? (
    <FlatList
      ref={scrollViewRef}
      data={distressCalls}
      getItemLayout={(_, index) => ({ length: CARD_HEIGHT, offset: CARD_HEIGHT * index, index })}
      renderItem={({ item: distressCall }) => {
        const isPending = pendingDistressCalls.includes(distressCall);
        const crewMemberId = crewMembers[distressCall.crewMember];
        const image = { uri: `${host}/${crewMemberId || 'identity-unknown'}.png` };

        return (
          <DistressCallCard
            {...distressCall}
            isPending={isPending}
            image={image}
            onPinpointPress={async () => {
              setPendingDistressCalls((prevState) => [...prevState, distressCall]);
              await scheduleLocalNotification(distressCall);
            }}
          />
        );
      }}
      keyExtractor={(distressCall) => distressCall.id}
    />
  ) : (
    <FallbackView />
  );
};

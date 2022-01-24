import React from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { Card } from 'react-native-paper';
import { names } from '../../data/crew';
import { CachedImage } from '../../third-party-components/CachedImage';
import { AntDesign } from '@expo/vector-icons';

/**
 * Crew manifest styles
 */
const styles = StyleSheet.create({
  /**
   * The list of cards
   */
  list: {
    padding: 16,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  /**
   * Individual crew member card
   */
  card: {
    marginBottom: 16,
  },
  /**
   * Nice rounded user image
   */
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: 'rgb(98, 0, 238)',
    borderRadius: 24,
  },
  /**
   * Icon button to "bench" user
   */
  benchButton: {
    padding: 16,
  },
});

// We can't use react-native-paper's Avatar.Image here because it doesn't support our custom CachedImage component
const CrewMemberAvatar = ({ avatar }) => <CachedImage source={{ uri: avatar.uri }} style={styles.avatar} />;

/**
 * Renders an individual crew member's image and name in a card,
 * along with a button to "bench" them.
 */
const CrewMember = ({ item }) => {
  const [benched, setBenched] = React.useState(false);
  const toggleBenched = () => {
    setBenched(!benched);
  };

  const benchLabel = benched ? 'Benched' : 'Bench';
  const benchIcon = benched ? 'unlock' : 'lock';
  const benchColor = benched ? 'red' : 'black';

  return (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        left={() => <CrewMemberAvatar avatar={{ uri: item.avatar }} />}
        right={() => (
          <Pressable style={styles.benchButton} hitSlop={50} onPress={toggleBenched} accessibilityLabel={benchLabel}>
            <AntDesign name={benchIcon} size={24} color={benchColor} />
          </Pressable>
        )}
      />
    </Card>
  );
};

/**
 * A list of crew members. Uses <FlatList /> to allow handling huge numbers of crew
 * (it's a big space station!)
 */
const CrewManifest = ({ data }) => {
  return <FlatList data={data} keyExtractor={(item) => item.name} renderItem={(props) => <CrewMember {...props} />} />;
};

/**
 * The main crew manifest screen, protected by biometric authentication
 */
export const CrewManifestScreen = () => {
  return (
    <View style={styles.list}>
      <CrewManifest data={names} />
    </View>
  );
};

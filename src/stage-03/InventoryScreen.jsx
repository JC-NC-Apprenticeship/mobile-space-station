import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

// You'll likely want these:
//import { Alert, FlatList, Pressable } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Searchbar, FAB, Dialog, TextInput, Button, Card } from 'react-native-paper';

// You can remove this once you've got started
import { PlaceholderScreen } from '../_internal/components/PlaceholderScreen';

export const InventoryScreen = () => {
  // Some local state you might want
  //const [name, setName] = useState('');
  //const [quantity, setQuantity] = useState('');
  //const [inventoryItems, setInventoryItems] = useState([]);
  //const [isDialogVisible, setIsDialogVisible] = useState(false);

  useEffect(() => {
    // Perhaps do first-time load of inventory from storage here
  }, []);

  // We've set up the keyboard-avoiding view here for you because it can be a pain to configure
  // correctly. Note that it's here, and why, but don't worry about the implementation details.
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <PlaceholderScreen
        lessonLink="a-well-stocked-station"
        sourceFile="src/stage-03/InventoryScreen.jsx "
        demoSourceFile="src/completed-app/inventory/Inventory.jsx"
        demoRoute="DemoAppInventory"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

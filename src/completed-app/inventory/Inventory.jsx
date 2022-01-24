import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, FlatList, View, Image, KeyboardAvoidingView, Platform, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar, FAB, Dialog, TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Spacer } from '../components/Spacer';
import { Scanner } from '../components/Scanner';
import { AntDesign } from '@expo/vector-icons';
import emptyInventory from '../../../assets/empty-inventory.png';

const InventoryItem = ({ name, quantity }) => (
  <Card style={styles.item}>
    <Card.Title title={`${quantity}× ${name}`} />
  </Card>
);

/**
 * Shown when there are no distress calls yet made
 */
const FallbackView = () => (
  <View style={styles.fallbackView}>
    <Image source={emptyInventory} style={styles.fallbackImage} resizeMode="contain" />
    <Title>Nothing here yet</Title>

    <Paragraph>Better get cracking before Captain Yuno finds out!</Paragraph>
  </View>
);

export const InventoryScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const quantityInputRef = useRef();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <Pressable onPress={showDialog}>
          <AntDesign name="plus" size={24} color="black" style={{ marginRight: 16 }} />
        </Pressable>
      ),
    });
  }, [navigation, showDialog]);

  useEffect(() => {
    const getItems = async () => {
      const storageItems = await AsyncStorage.getItem('@inventory-items');
      const parsedItems = JSON.parse(storageItems);
      setInventoryItems(parsedItems || inventoryItems);
    };

    getItems();
  }, [inventoryItems]);

  const storeInventoryItems = async () => {
    setName('');
    setQuantity('');
    try {
      const item = { name, quantity };
      const newItems = [...inventoryItems, item];
      setInventoryItems(newItems);

      await AsyncStorage.setItem('@inventory-items', JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to store inventory item', e);
    }
  };

  const hideDialog = () => setIsDialogVisible(false);
  /**
   * We memo-ise this with useCallback because it's a dependency of the
   * layoutEffect above, and would otherwise change on each render
   */
  const showDialog = useCallback(() => {
    setIsDialogVisible(true);
    hideScanner();
  }, []);
  const showScanner = () => {
    setIsScannerVisible(true);
  };
  const hideScanner = () => {
    setIsScannerVisible(false);
  };

  const isValidItem = (itemToCheck) => itemToCheck.name && itemToCheck.quantity;

  const handleScan = ({ data }) => {
    try {
      const item = JSON.parse(data);
      if (!isValidItem(item)) throw new Error();
      setName(item.name);
      setQuantity(item.quantity);
    } catch (err) {
      Alert.alert("That's not a Station 76 item, sorry!");
    }
    hideScanner();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inventory}>
        <Searchbar value={searchText} onChangeText={setSearchText} />
        <Spacer />

        {inventoryItems.length ? (
          <FlatList
            data={inventoryItems.filter(({ name }) => name.toLowerCase().includes(searchText.toLowerCase()))}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => <InventoryItem name={item.name} quantity={item.quantity} />}
          />
        ) : (
          <FallbackView />
        )}

        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Add item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="flat"
              label="Name"
              returnKeyType="next"
              onChangeText={setName}
              onSubmitEditing={() => quantityInputRef.current.focus()}
              value={name}
            />
            <Spacer />
            <TextInput
              ref={quantityInputRef}
              mode="flat"
              label="Quantity"
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={setQuantity}
              value={quantity}
            />
            <Spacer />
            <Button flat onPress={showScanner}>
              Or scan a QR Code
            </Button>

            {isScannerVisible && <Scanner onScan={handleScan} />}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={storeInventoryItems} disabled={name === '' || quantity === ''}>
              Add
            </Button>
            <Button onPress={hideDialog} color="red">
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
        {Platform.OS === 'ios' ? null : <FAB style={styles.fab} icon="plus" onPress={showDialog} />}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
  },
  inventory: {
    padding: 16,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fallbackView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackImage: {
    width: 200,
    height: 150,
    opacity: 0.3,
  },
});

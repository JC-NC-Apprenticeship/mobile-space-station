import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, IconButton, List, Modal, Text, Title } from 'react-native-paper';

import { formatCurrency, todaysMenu } from './helpers';
import { styles } from './styles';

export const MenuModal = ({ order, setShowCheckout, showMenu, setShowMenu, updateOrder }) => {
  const onCheckout = () => {
    setShowMenu(false);
    setShowCheckout(true);
  };

  const dismiss = () => {
    setShowMenu(false);
  };

  return (
    <Modal contentContainerStyle={styles.modal} onDismiss={dismiss} visible={showMenu}>
      <Title>{`Current order total: ${formatCurrency(order.total)}`}</Title>
      <Button disabled={order.total === 0} onPress={onCheckout}>
        Complete your order
      </Button>
      <ScrollView>
        {todaysMenu.map((item) => (
          <MenuItem key={item.id} {...item} order={order} updateOrder={updateOrder} />
        ))}
      </ScrollView>
      <IconButton onPress={dismiss} style={styles.closeButton} icon="close" />
    </Modal>
  );
};

const MenuItem = ({ id, name, price, order, updateOrder }) => {
  const [quantity, setQuantity] = useState(order.items[id]?.quantity ?? 0);

  const updateItem = (increment) => {
    setQuantity((current) => current + increment);
    updateOrder(id, increment);
  };

  return (
    <Card style={styles.margin}>
      <List.Item description={formatCurrency(price)} title={name} />
      <View style={styles.menuItem}>
        <IconButton disabled={quantity === 0} icon="minus" onPress={() => updateItem(-1)} />
        <Text style={styles.menuQuantity}>{quantity}</Text>
        <IconButton icon="plus" onPress={() => updateItem(1)} />
      </View>
    </Card>
  );
};

import { initStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Card, Portal, Provider } from 'react-native-paper';

import { CheckoutModal } from './Checkout';
import { ConfirmationModal } from './ConfirmationModal';
import { defaultOrderState, fetchPublishableKey, formatCurrency, todaysMenu } from './helpers';
import { HouseRules } from './HouseRules';
import { MenuModal } from './Menu';
import { styles } from './styles';

/**
 * Welcome to the Station 76 Cafe
 */
export const CanteenScreen = () => {
  const [order, setOrder] = useState(defaultOrderState);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      const publishableKey = await fetchPublishableKey();
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.com.stripe.react.native',
          urlScheme: 'stripe-example',
          setUrlSchemeOnAndroid: true,
        });
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  const updateOrder = (itemId, increment) => {
    const { id, price } = todaysMenu.find((menuItem) => itemId === menuItem.id);
    let quantity;
    if (order.items[id]) {
      quantity = order.items[id].quantity + increment;
    } else {
      quantity = increment;
    }
    const total = order.total + price * increment;
    setOrder({ items: { ...order.items, [id]: { quantity } }, total });
  };

  return isLoading ? (
    <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
  ) : (
    <Provider>
      <View style={[styles.container, styles.flex]}>
        <Card style={[styles.card, styles.flex]}>
          <Card.Title title="Welcome to the Station 76 Cafe" />
          <Card.Content style={[styles.cardContent, styles.flex]}>
            <HouseRules />
            <Button onPress={() => setShowMenu(true)} style={styles.button}>
              {"Today's menu"}
            </Button>
            <Button
              disabled={order.total === 0}
              onPress={() => setShowCheckout(true)}
              style={styles.button}
            >{`Your order (${formatCurrency(order.total)})`}</Button>
          </Card.Content>
        </Card>
      </View>
      <Portal>
        <MenuModal
          order={order}
          setShowCheckout={setShowCheckout}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          updateOrder={updateOrder}
        ></MenuModal>
        <CheckoutModal
          order={order}
          setOrder={setOrder}
          setShowCheckout={setShowCheckout}
          showCheckout={showCheckout}
          setShowConfirmation={setShowConfirmation}
        ></CheckoutModal>
        <ConfirmationModal
          order={order}
          setShowConfirmation={setShowConfirmation}
          showConfirmation={showConfirmation}
        ></ConfirmationModal>
      </Portal>
    </Provider>
  );
};

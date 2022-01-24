import { ApplePayButton, useApplePay, useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, Card, IconButton, List, Modal, Title } from 'react-native-paper';

import { defaultOrderState, fetchPaymentIntentClientSecret, formatCurrency, getCartItems, getItems } from './helpers';
import { styles } from './styles';

export const CheckoutModal = ({ order, setOrder, showCheckout, setShowCheckout, setShowConfirmation }) => {
  const { presentApplePay, confirmApplePayPayment, isApplePaySupported } = useApplePay();
  const [clientSecret, setClientSecret] = useState();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const initialisePaymentSheet = async () => {
      const paymentIntentClientSecret = await fetchPaymentIntentClientSecret(order);
      setClientSecret(paymentIntentClientSecret);

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret,
        customFlow: false,
        country: 'GB',
        merchantDisplayName: 'Station 76',
        style: 'alwaysDark',
      });

      if (!error) {
        setPaymentSheetEnabled(true);
      }
    };

    if (showCheckout) {
      initialisePaymentSheet();
    }
  }, [initPaymentSheet, order, showCheckout]);

  const confirmPayment = () => {
    setShowCheckout(false);
    setShowConfirmation(true);
    setOrder(defaultOrderState);
  };

  const dismiss = () => {
    setShowCheckout(false);
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    const { error } = await presentPaymentSheet({
      clientSecret,
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      confirmPayment();
    }
  };

  const items = getItems(order);

  const onPayByApplePay = async () => {
    const cartItems = getCartItems(order);

    const { error } = await presentApplePay({
      cartItems,
      country: 'GB',
      currency: 'GBP',
    });

    if (error) {
      Alert.alert(error.code, error.message);
    } else {
      const clientSecret = await fetchPaymentIntentClientSecret(order);

      const { error: confirmApplePayError } = await confirmApplePayPayment(clientSecret);

      if (confirmApplePayError) {
        Alert.alert(confirmApplePayError.code, confirmApplePayError.message);
      } else {
        confirmPayment();
      }
    }
  };

  return (
    <Modal contentContainerStyle={[styles.checkout, styles.modal]} onDismiss={dismiss} visible={showCheckout}>
      <Title>Your order:</Title>

      <ScrollView>
        {items.map((item) => (
          <CheckoutItem key={item.id} {...item} />
        ))}
      </ScrollView>

      <Title style={styles.margin}>{`Total: ${formatCurrency(order.total)}`}</Title>

      {isApplePaySupported && (
        <ApplePayButton
          onPress={onPayByApplePay}
          type="plain"
          buttonStyle="black"
          borderRadius={4}
          style={styles.applePayButton}
        />
      )}

      <Button disabled={!paymentSheetEnabled} onPress={openPaymentSheet} style={styles.button}>
        Pay by Card
      </Button>

      <IconButton onPress={dismiss} style={styles.closeButton} icon="close" />
    </Modal>
  );
};

const CheckoutItem = ({ name, price, quantity }) => {
  return (
    <Card style={styles.margin}>
      <List.Item
        description={`${formatCurrency(price * quantity)}${
          quantity > 1 ? ` (${quantity}x ${formatCurrency(price)})` : ''
        }`}
        title={`${quantity}x ${name}`}
      />
    </Card>
  );
};

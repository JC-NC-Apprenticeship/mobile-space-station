import React from 'react';
import { IconButton, Modal, Title } from 'react-native-paper';

import { styles } from './styles';

export const ConfirmationModal = ({ showConfirmation, setShowConfirmation }) => {
  const dismiss = () => {
    setShowConfirmation(false);
  };

  return (
    <Modal contentContainerStyle={styles.modal} onDismiss={dismiss} visible={showConfirmation}>
      <Title style={styles.confirmation}>{`Enjoy your meal!`}</Title>

      <IconButton onPress={dismiss} style={styles.closeButton} icon="close" />
    </Modal>
  );
};

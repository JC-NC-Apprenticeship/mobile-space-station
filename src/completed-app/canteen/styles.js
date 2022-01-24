import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  applePayButton: {
    width: '50%',
    height: 50,
    marginTop: 60,
    alignSelf: 'center',
  },
  button: { margin: 40 },
  card: { padding: 5 },
  cardContent: { justifyContent: 'space-between' },
  checkout: { justifyContent: 'flex-start' },
  closeButton: { position: 'absolute', top: 10, right: 10 },
  confirmation: { alignSelf: 'center' },
  container: {
    padding: 16,
  },
  flex: { flex: 1 },
  margin: { margin: 5 },
  menuItem: { justifyContent: 'center', flexDirection: 'row' },
  menuQuantity: { alignSelf: 'center' },
  modal: { flex: 1, backgroundColor: 'whitesmoke', padding: 20, margin: 20 },
});

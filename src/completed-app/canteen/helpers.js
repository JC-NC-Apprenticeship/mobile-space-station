import faker from 'faker';

const API_URL = 'https://lying-tree-whip.glitch.me';

export const defaultOrderState = { items: {}, total: 0 };

export const fetchPaymentIntentClientSecret = async (items, currency = 'gbp') => {
  const response = await fetch(`${API_URL}/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency,
      items,
    }),
  });
  const { clientSecret } = await response.json();

  return clientSecret;
};

export const fetchPublishableKey = async () => {
  try {
    const response = await fetch(`${API_URL}/stripe-key`);

    const { publishableKey } = await response.json();

    return publishableKey;
  } catch (e) {
    console.warn('Unable to fetch publishable key');
    return null;
  }
};

export const formatCurrency = (number) => {
  return `£${typeof number === 'number' ? number.toFixed(2) : number}`;
};

const generateMenu = () => {
  // generate the same menu for each day
  const today = new Date();
  const seed = Number(`${today.getFullYear()}${today.getMonth()}${today.getDate()}`);
  faker.seed(seed);

  // 10 random items
  const menu = Array(10)
    .fill()
    .map(() => ({
      id: faker.datatype.uuid(),
      name: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
      price: faker.commerce.price(1, 20),
    }));

  return menu;
};

export const getCartItems = (order) => [{ label: 'Total', amount: String(order.total), type: 'final' }];

export const getItems = (order) =>
  Object.entries(order.items)
    .filter(([, { quantity }]) => quantity)
    .map(([id, { quantity }]) => {
      const menuItem = todaysMenu.find((item) => item.id === id);

      return { ...menuItem, quantity };
    });

export const todaysMenu = generateMenu();

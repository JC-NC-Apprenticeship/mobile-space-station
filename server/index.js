const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = 5000;
const randomDelay = () => Math.floor(1000 + Math.random() * 2000);

const app = express();

app.use(cors());

app.get('*', (req, __, next) => {
  const { delay } = req.query;
  setTimeout(next, delay || randomDelay());
});

app.use('/', express.static(path.join(__dirname, 'network-assets')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

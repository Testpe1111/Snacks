const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let menu = '';
let raisedHands = new Set();

app.get('/menu', (req, res) => {
  res.json({ menu });
});

app.post('/menu', (req, res) => {
  const { key, newMenu } = req.body;
  if (key !== 'admin123') return res.status(403).json({ error: 'Unauthorized' });

  menu = newMenu;
  raisedHands.clear();
  res.json({ message: 'Menu updated' });
});

app.post('/raise-hand', (req, res) => {
  const { userId } = req.body;
  if (raisedHands.has(userId)) {
    return res.status(400).json({ error: 'Already raised hand today' });
  }
  raisedHands.add(userId);
  res.json({ message: 'Hand raised' });
});

app.get('/raised-count', (req, res) => {
  res.json({ count: raisedHands.size });
});

cron.schedule('0 0 * * *', () => {
  console.log('Resetting menu and hands at midnight');
  menu = '';
  raisedHands.clear();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
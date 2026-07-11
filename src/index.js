require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const ItemService = require('./service/ItemService');
const itemsRouter = require('./routes/items');
const PostgresItemRepository = require('./repositories/PostgresItemRepository');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const repository = new PostgresItemRepository(pool);
const service = new ItemService(repository);

const app = express();
app.use(express.json());
app.use('/items', itemsRouter(service));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
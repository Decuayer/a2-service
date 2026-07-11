require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');

const ItemService = require('./service/ItemService');
const itemsRouter = require('./routes/items');
const PostgresItemRepository = require('./repositories/PostgresItemRepository');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().then(async () => {
  const pong = await redisClient.ping();
  console.log('Redis ping:', pong);
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
const express = require('express');

function itemsRouter(service) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const item = await service.createItem(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/', async (req, res) => {
    const items = await service.listItems();
    res.json(items);
  });

  router.get('/:id', async (req, res) => {
    const item = await service.getItem(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(item);
  });

  return router;
}

module.exports = itemsRouter;
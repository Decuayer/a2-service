class InMemoryItemRepository {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  async create({ name }) {
    const item = {
      id: this.nextId++,
      name,
      created_at: new Date().toISOString(),
    };
    this.items.push(item);
    return item;
  }

  async findAll() {
    return this.items;
  }

  async findById(id) {
    return this.items.find((i) => i.id === Number(id)) ?? null;
  }
}

module.exports = InMemoryItemRepository;
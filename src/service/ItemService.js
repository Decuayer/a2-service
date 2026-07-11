class ItemService {
  constructor(repository) {
    this.repository = repository;
  }

  async createItem(data) {
    if (!data.name) {
      throw new Error('name is required');
    }
    return this.repository.create(data);
  }

  async listItems() {
    return this.repository.findAll();
  }

  async getItem(id) {
    return this.repository.findById(id);
  }
}

module.exports = ItemService;
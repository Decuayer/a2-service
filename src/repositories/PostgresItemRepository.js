class PostgresItemRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ name }) {
    const res = await this.pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name]
    );
    return res.rows[0];
  }

  async findAll() {
    const res = await this.pool.query('SELECT * FROM items ORDER BY id');
    return res.rows;
  }

  async findById(id) {
    const res = await this.pool.query(
      'SELECT * FROM items WHERE id = $1',
      [id]
    );
    return res.rows[0] ?? null;
  }
}

module.exports = PostgresItemRepository;
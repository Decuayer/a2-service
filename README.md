# A2 Service — Postgres Integration

## How to Run

1. Clone the repository.
2. Copy the `.env.example` file as `.env` (not required when running with Docker Compose; used only for local development outside Docker).
3. Start the entire stack:

\`\`\`bash
docker compose up --build -d
\`\`\`

4. The API will be available at `localhost:3000`.

## Architecture

- `src/service/ItemService.js` — business logic, storage-agnostic
- `src/routes/items.js` — HTTP routes, storage-agnostic
- `src/repositories/InMemoryItemRepository.js` — egacy in-memory implementation (deprecated, kept for reference)
- `src/repositories/PostgresItemRepository.js` — new Postgres implementation

## In-memory'den Postgres'e geçiş

Only the repository selection in the `src/index.js` file was changed:

\`\`\`js
// Before
const repository = new InMemoryItemRepository();

// After
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const repository = new PostgresItemRepository(pool);
\`\`\`

The `ItemService.js` and `routes/items.js` files **remained completely unchanged**. This was possible because the repository interface (create/findAll/findById) is identical in both implementations.

## Persistence Testing

1. The stack was started using `docker compose up -d`.
2. Data was added via 3 POST requests (`test-1`, `test-2`, `test-3`).
3. Verified that all 3 records were returned using `GET /items`.
4. Both app and db containers were completely stopped and removed using `docker compose down` (volumes were not deleted).
5. The stack was restarted using `docker compose up -d`.
6. Called `GET /items` again — all 3 records were still returned.

Proof (terminal output):

\`\`\`
$ curl localhost:3000/items
[{"id":1,"name":"test-1","created_at":"..."},
 {"id":2,"name":"test-2","created_at":"..."},
 {"id":3,"name":"test-3","created_at":"..."}]

$ docker compose down
[+] Running 2/2
 ✔ Container a2-service-app-1  Removed
 ✔ Container a2-service-db-1   Removed

$ docker compose up -d
[+] Running 2/2
 ✔ Container a2-service-db-1   Started
 ✔ Container a2-service-app-1  Started

$ curl localhost:3000/items
[{"id":1,"name":"test-1","created_at":"..."},
 {"id":2,"name":"test-2","created_at":"..."},
 {"id":3,"name":"test-3","created_at":"..."}]
\`\`\`

Data was preserved because the stack was stopped with `docker compose down`, not `docker compose down -v` (which would delete the `pgdata` volume).
## Environment Variables

See the `.env.example` file. The actua `.env` file is in `.gitignore` and not committed to the repository.
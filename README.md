### EnergeX-AI

Full-Stack Developer Technical Assessment

#### Objective
Build a microservice API using Lumen (PHP) and Node.js (TypeScript) that integrates with Redis for caching, a MySQL database, and a simple frontend (React.js or Vue.js) to consume the API.

### Assessment Breakdown

| Section                    | Task                                                                 |
|---------------------------|----------------------------------------------------------------------|
| Backend (Lumen)           | Build a RESTful API using Lumen with JWT authentication              |
| Backend (Node.js)         | Create a caching layer with Redis for fast API responses             |
| Database (MySQL)          | Store and retrieve user and post data in MySQL                       |
| Frontend (React/Vue)      | Create a simple UI that consumes the API                             |
| Testing                   | Write unit tests for API endpoints (PHPUnit/Jest)                    |
| DevOps (Docker)           | Containerize the application using Docker                            |
| CI/CD                     | Set up GitHub Actions/GitLab CI to automate testing                  |

#### Architecture
<img width="464" height="84" alt="image" src="https://github.com/user-attachments/assets/670c6b10-250a-4c97-a191-0982dbe5a3a6" />

The Lumen API owns authentication and post creation.
The Node cache serves reads for posts via Redis; on a MISS it queries MySQL, then caches the result.

#### Backend
##### Lumen (PHP) API
| Method | Endpoint          | Auth | Description                           |
| -----: | ----------------- | :--: | ------------------------------------- |
|   POST | `/api/register`   |   –  | Register user (name, email, password) |
|   POST | `/api/login`      |   –  | Login and receive a JWT               |
|    GET | `/api/posts`      |  JWT | List posts (served via cache layer)   |
|   POST | `/api/posts`      |  JWT | Create a post (title, content)        |
|    GET | `/api/posts/{id}` |  JWT | Get one post (served via cache layer) |

The PHP API focuses on auth and writes. Reads can go through the cache service below.

##### Node.js (TypeScript) Cache API
| Method | Endpoint           | Description                                    |
| -----: | ------------------ | ---------------------------------------------- |
|    GET | `/health`          | Health check                                   |
|    GET | `/cache/posts`     | Posts from Redis; on MISS, query DB then cache |
|    GET | `/cache/posts/:id` | One post from Redis; on MISS, query then cache |

#### Backend Implementation
##### (Lumen – PHP)
1. A Lumen microservice that exposes a small REST API for authentication and posts.
2. JWT auth: /api/login issues a signed token; protected routes use a JWT middleware.
3. User registration: /api/register validates input and stores a bcrypt-hashed password in MySQL.
4. Posts CRUD (create + read):
POST /api/posts creates a post for the authenticated user.
GET /api/posts and GET /api/posts/{id} first check Redis (keys posts:all and posts:{id}) and fall back to MySQL on a miss; results are cached with a TTL.
5. Proper HTTP status codes and JSON error messages throughout; simple cache warm/refresh on create.
6. A Postman collection is included to exercise register, login, and posts endpoints.

##### Backend (Node.js – TypeScript)
1. This section is the Node.js (TypeScript) cache service we built to sit in front of MySQL and speed up reads:
2. A small Express app that connects to Redis and MySQL (mysql2/promise).
3. Endpoints:
   1. GET /cache/posts – returns the list of posts.
   2. Looks up key posts:all in Redis → HIT: return cached JSON (sets X-Cache: HIT).
   3. MISS: reads rows from MySQL, stores them in Redis with a TTL, returns JSON (sets X-Cache: MISS).
   4. GET /cache/posts/:id – returns a single post.
   5. Checks posts:{id} in Redis first; on miss, queries MySQL, caches the row, then returns it.

##### Database
1. Schema: We created a MySQL database with two tables:
   1. users (id, name, email UNIQUE, password, created_at, updated_at)
   2. posts (id, title, content, user_id FK → users.id, created_at, updated_at, index on user_id, ON DELETE SET NULL)
2. Bootstrap scripts: The repo contains container-init SQL:
   1. mysql/init/01-schema.sql — creates the tables with utf8mb4 + InnoDB and the FK.
   2. mysql/init/02-seed.sql — inserts a sample user and post so the app can start with data.
3. Passwords: When a user registers through the Lumen API, the password is hashed (bcrypt) before being stored.
4. Lumen performs CRUD and issues JWTs.
5. The Node cache reads posts (and writes them into Redis on a cache miss).
6. Docker: MySQL is run via Docker Compose with health checks; credentials and DB name are provided through env vars used by Lumen and the Node cache.

##### Frontend
1. Stack: React (Vite + TypeScript). One-page app in src/App.tsx with a tiny Axios wrapper in src/lib/api.ts.
2. Auth flows:
  1. Register form posts to POST /api/register (name, email, password).
  2. Login form posts to POST /api/login; the returned JWT is kept in state (and sent on subsequent calls via Authorization: Bearer <token>).
3. Posts UI:
  1. After login, it calls GET /api/posts to show the list.
  2. Provides a simple create post form that submits to POST /api/posts (title, content).
4. Status & UX: success/error banners, disabled/hidden sections when not authenticated, centered clean layout.
5. Proxy/wiring: Vite dev server proxies /api/* to the Lumen backend on :8000, so the frontend calls /api/... without CORS issues.

### File Paths
| Section (task)                 | Path(s)                                                                                               | What it contains                                                                                                 |
|--------------------------------|--------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| **Backend (Lumen – PHP)**      | `php-api/`                                                                                             | Lumen app code (`app/`, `routes/`, `public/`), `.env*`, `phpunit.xml`, **Dockerfile**, PHPUnit tests under `tests/` |
| **Backend (Node.js – TS)**     | `node-cache/`                                                                                          | Express + Redis cache service (TypeScript) in `src/` (`server.ts`, `db.ts`), Jest tests in `tests/`, `.env.docker`, **Dockerfile** |
| **Database (MySQL)**           | `mysql/init/01-schema.sql`, `mysql/init/02-seed.sql`                                                   | Schema + seed files executed automatically by the MySQL container                                               |
| **Frontend (React/Vite)**      | `src/`, `index.html`, `vite.config.ts`                                                                 | Minimal UI to register/login, create posts, and view the list                                                   |
| **Testing (PHPUnit – Lumen)**  | `php-api/tests/**`                                                                                     | Lumen API tests (`TestCase.php`, `Feature/AuthTest.php`, `Feature/PostsTest.php`)                               |
| **Testing (Jest – Node cache)**| `node-cache/tests/**`                                                                                  | Cache API tests (`cache.spec.ts`)                                                                               |
| **DevOps (Docker)**            | `docker-compose.yml`                                                                                   | Orchestrates PHP (Lumen), Node cache, MySQL, and Redis containers (with ports/healthchecks/volumes)             |
| **Postman collection**         | `Screening Test – EnergeX – Backend.postman_collection.json`                                           | Ready-to-import Postman requests for Register/Login/Posts                                                        |

### Repository tree
```text
~/code/energex
├─ docker-compose.yml
├─ mysql/
│  └─ init/
│     ├─ 01-schema.sql
│     └─ 02-seed.sql
├─ node-cache/
│  ├─ Dockerfile
│  ├─ .env.docker
│  ├─ src/
│  │  ├─ server.ts
│  │  └─ db.ts
│  └─ tests/
│     └─ cache.spec.ts
├─ php-api/
│  ├─ Dockerfile
│  ├─ .env.docker
│  ├─ app/       
│  ├─ routes/
│  ├─ public/
│  └─ tests/
│     ├─ TestCase.php
│     └─ Feature/
│        ├─ AuthTest.php
│        └─ PostsTest.php
├─ src/          
└─ Screening Test - EnergeX - Backend.postman_collection.json


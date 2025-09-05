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


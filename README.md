### EnergeX

Full-Stack Developer Technical Assessment

#### Objective
Build a microservice API using Lumen (PHP) and Node.js (TypeScript) that integrates with Redis for caching, a MySQL database, and a simple frontend (React.js or Vue.js) to consume the API.

### Assessment Breakdown
1. Backend (Lumen)	Build a RESTful API using Lumen with JWT authentication	
2. Backend (Node.js)	Create a caching layer with Redis for fast API responses
3. Database (MySQL)	Store and retrieve user and post data in MySQL
4. Frontend (React/Vue)	Create a simple UI that consumes the API	
5. Testing	Write unit tests for API endpoints (PHPUnit/Jest)
6. DevOps (Docker)	Containerize the application using Docker
7. CI/CD	Set up GitHub Actions/GitLab CI to automate testing

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
│  ├─ app/        # Lumen application code
│  ├─ routes/
│  ├─ public/
│  └─ tests/
│     ├─ TestCase.php
│     └─ Feature/
│        ├─ AuthTest.php
│        └─ PostsTest.php
├─ src/           # React (Vite) frontend
└─ Screening Test - EnergeX - Backend.postman_collection.json



### File Paths
| Section (task)             | Path(s)                                                      | What it contains                                                                 |
| -------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Backend (Lumen – PHP)**  | `php-api/` - Backend (Lumen – PHP) 1.txt, Backend (Lumen – PHP) 2.txt, EnergeX.sql                                                 | Lumen code (routes, controllers, models), `.env*`, `phpunit.xml`, **Dockerfile** |
| **Backend (Node.js – TS)** | `node-cache/` - Backend (Node.js – TypeScript) - 1.txt, Backend (Node.js – TypeScript)-2.txt                                               | Express + Redis cache service (TypeScript), Jest tests, **Dockerfile**           |
| **Database (MySQL)**       | `mysql/init/01-schema.sql`, `mysql/init/02-seed.sql` - Database (MySQL).txt        | Schema + seed that init the DB in Docker                                         |
| **Frontend (React/Vite)**  | `src/`, `index.html`, `vite.config.ts` -                       | Minimal UI to register/login/create posts and view the list                      |
| **Testing**                | `php-api/tests/**` (PHPUnit), `node-cache/tests/**` (Jest) - Lumen (PHP) tests with PHPUnit.txt, Node cache API tests.txt  | Unit tests for both backends                                                     |
| **DevOps (Docker)**        | `docker-compose.yml`   - DevOps (Docker).txt                                      | Orchestrates PHP, Node cache, MySQL, Redis                                       |
| **Postman collection**     | `Screening Test - EnergeX - Backend.postman_collection.json` | Ready-to-import requests for Register/Login/Posts                                |




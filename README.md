# MyHomePathway Challenge

## Backend

### Run locally

-Prerequisites

- Node.js 18+
- yarn

1- Install Dependencies

```bash
cd backend
yarn
```

2- Environment Configuration

Create a `.env` file in the backend directory:

```bash
# Database
DATABASE_URL="file:./dev.db"

# OMDB API (get your free key at http://www.omdbapi.com/apikey.aspx)
OMDB_API_KEY="your_omdb_api_key_here"
```

3- Run the Backend

```bash
yarn start:dev
```

The backend will be available at `http://localhost:3001`

### API Endpoints

- `GET /movies?search=batman&page=1` - Search movies
- `GET /movies/favorites` - List favorite movies
- `POST /movies/favorites` - Add movie to favorites
- `DELETE /movies/favorites/:id` - Remove movie from favorites

### Decisions

On the backend, I followed all the NestJS recommendation standards to build the API, such as validation using class-validator and the proper project structure.

For the database connection, I used Prisma and SQLite. For a production environment, I would definitely change to Postgres, but in order to achieve faster development and avoid the need to create a docker-compose to make testing easier, I used SQLite.

I applied some of the code quality tools that I use in my job and personal projects, such as ESLint and Prettier, import sorting, and TypeScript paths. For production code, I would also add Husky for pre-commit/pre-push checks and pipelines to run tests before merging.

### Deploying

To deploy a backend application like this one, I would build a Dockerfile to generate an image and deploy it on AWS using ECS, which allows me to have auto-scaling and load balancing easily. For the database, I would use RDS or EC2 depending on the price.

I would also build CI/CD pipelines to automate the deployment, assuming a role via OIDC and applying the changes to the production AWS account.

Another approach would be building a Docker Compose setup and running all the services on an EC2 instance. It is much easier to manage and, depending on the project needs, it's already sufficient.

## Frontend

### Run locally

-Prerequisites

- Node.js 18+
- yarn

1- Install Dependencies

```bash
cd frontend
yarn
```

2- Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001
```

3- Run the Frontend

```bash
yarn dev
```

The frontend will be available at `http://localhost:3000`

---

### Decisions

For the frontend, I decided to use Shadcn/ui and Tailwind CSS, which is the combination I have been using lately to build web apps.

There are plenty of places where there could be better validation and implementations, but I tried to get the basics working due to the time available. I also kept the TanStack Query implementation simple.

### Deploying

For apps using Next.js, I would deploy on Vercel, as it also has default integration with GitHub repositories, which would allow fast implementation of a CI/CD process.

## Quick Start

1. Start backend: `cd backend && yarn start:dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000`
4. Search for movies and add to favorites!

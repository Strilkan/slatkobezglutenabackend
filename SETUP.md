# Setup Guide

## Prerequisites

- Node.js >= 20.0.0
- npm >= 6.0.0

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Strilkan/slatkobezglutenabackend.git
cd slatkobezglutenabackend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run develop
```

The server will start at `http://localhost:1337`

## First Time Setup

1. Open your browser and navigate to `http://localhost:1337/admin`
2. Create your first admin user
3. After logging in, configure API permissions for the Recipe content type:
   - Go to Settings > Users & Permissions plugin > Roles > Public
   - Enable the following permissions for Recipe:
     - `find` (to get all recipes)
     - `findOne` (to get a single recipe)
   - Save the changes

## API Endpoints

Once configured, the following endpoints will be available:

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a single recipe
- `POST /api/recipes` - Create a new recipe (requires authentication)
- `PUT /api/recipes/:id` - Update a recipe (requires authentication)
- `DELETE /api/recipes/:id` - Delete a recipe (requires authentication)

## Environment Variables

The `.env` file is generated automatically and contains sensitive information. Make sure to keep it secret and never commit it to version control.

Key environment variables:
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 1337)
- `APP_KEYS` - Application keys for session encryption
- `API_TOKEN_SALT` - Salt for API token generation
- `ADMIN_JWT_SECRET` - Secret for admin JWT tokens
- `TRANSFER_TOKEN_SALT` - Salt for transfer tokens
- `JWT_SECRET` - Secret for JWT tokens

## Database

By default, the project uses SQLite database stored in `.tmp/data.db`. This is suitable for development but not recommended for production.

For production, you can configure PostgreSQL or MySQL by updating the `config/database.ts` file and setting the appropriate environment variables.

## Production Deployment

1. Build the admin panel:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

For more deployment options, see the [Strapi deployment documentation](https://docs.strapi.io/dev-docs/deployment).

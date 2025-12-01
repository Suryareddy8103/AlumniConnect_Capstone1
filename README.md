# Alumni Network Backend

Node.js + Express + MongoDB backend powering the alumni network frontend pages (`index.html`, `login.html`, `register.html`, `directory.html`, `dashboard.html`, `events.html`, `jobs.html`, `success-stories.html`).

## Quick Start

1. Install deps: `npm install`
2. Start dev server (auto-creates `.env` if missing): `npm run dev`
3. Open in browser:
   - `http://localhost:4000/login.html`
   - `http://localhost:4000/admin.html`
4. Optional: Seed in-memory DB sample data: `npm run seed`

Default admin: `admin@example.com / ChangeMe123!`

## Scripts
- `npm start` - start server (production)
- `npm run dev` - create `.env` if needed, start with nodemon
- `npm run seed` - seed admin and sample data (uses in-memory DB)

## Tech
- Express, Mongoose, JWT, bcrypt, express-validator, multer
- Security: helmet, CORS
- Docs: Swagger (OpenAPI)

## Structure
```
src/
  server.js
  app.js
  config/
    db.js
  middlewares/
    auth.js
    errorHandler.js
    validate.js
  models/
    User.js
    Event.js
    Job.js
    Story.js
  controllers/
    auth.controller.js
    users.controller.js
    events.controller.js
    jobs.controller.js
    stories.controller.js
    dashboard.controller.js
  routes/
    index.js
    auth.routes.js
    users.routes.js
    events.routes.js
    jobs.routes.js
    stories.routes.js
    dashboard.routes.js
  utils/
    uploader.js
    roles.js
  scripts/
    seed.js
    bootstrap-env.js
  docs/
    swagger.js
```

## Environment
If `.env` does not exist, `npm run dev` will create it with:
```
MONGODB_URI=mongodb://127.0.0.1:27017/alumni_network
JWT_SECRET=devsecret
PORT=4000
```

## API Docs
Swagger UI available at `/api/docs` after server starts.

## Frontend Integration
- Always access pages via `http://localhost:4000/...` so API requests share the same origin.
- All endpoints return JSON. Use `Authorization: Bearer <token>` for protected routes.
- Events use `multipart/form-data` for file uploads (handled automatically in the UI).
- Static uploaded images are served from `/uploads/<filename>`.

## Troubleshooting
- If admin actions do not persist:
  - Ensure MongoDB is running and reachable at `MONGODB_URI` in `.env`.
  - Use the pages served by Node (`http://localhost:4000/...`), not `file://` paths.
  - Check DevTools → Network for status and error messages on failed requests.

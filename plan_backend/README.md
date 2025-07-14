# Plan Backend

Simple Express server using MongoDB with user roles and transactions.

## Scripts

- `npm install` – install dependencies
- `npm run seed` – seed sample users and transactions
- `npm start` – start the server

## API Endpoints

- `POST /api/auth/register` – register a new user
- `POST /api/auth/login` – login and start a session
- `POST /api/plans/purchase` – authenticated users buy a plan
- `POST /api/auth/logout` – end the current session
- `GET /api/admin/transactions` – admin only, list all transactions with user info

Set `MONGO_URI` and `SESSION_SECRET` in an `.env` file.

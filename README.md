# Finance Dashboard Backend
A robust backend system for a Finance Dashboard, featuring Role-Based Access Control (RBAC), transaction tracking, and financial analytics.

## 🔗 Live Demo

**URL**: https://finance-data-processing-backend-apk0.onrender.com/

**API Version**: v1

**Documentation**: https://finance-data-processing-backend-apk0.onrender.com/api-docs


## 🚀 Deployment

The project is production-ready with environment-aware configuration.

### 1. Environment Checklist (Production)
Ensure these are set in your cloud provider:

**Server**
- `NODE_ENV`: `production`
- `PORT`: Port for the server (usually auto-assigned by cloud host).
- `API_VERSION`: e.g., `v1`


**Database**
- `MONGODB_URI`: Production MongoDB Atlas string.

**Auth & Cookies**
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Secure random strings for token signing.
- `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN`: Lifespan of tokens (e.g., `15m`, `7d`).
- `ACCESS_TOKEN_MAX_AGE` / `REFRESH_TOKEN_MAX_AGE`: Cookie max age in milliseconds.
- `BCRYPT_SALT_ROUNDS`: Salt rounds for password hashing (e.g., `12`).

**Email**
- `RESEND_API_KEY`: Resend API key for sending emails.

**Network & Rate Limiting**
- `CORS_ORIGINS`: Comma-separated list of allowed frontend URLs.
- `RATE_LIMIT_WINDOW_MS`: Time window for rate limiting in ms.
- `RATE_LIMIT_MAX_GLOBAL`: Global max requests per IP.
- `RATE_LIMIT_MAX_AUTH`: Max auth requests per IP.

### 2. Docker Deployment
```bash
docker build -t finance-backend .
docker run -p 5000:5000 --env-file .env finance-backend
```

### 3. Manual Deployment
```bash
npm install
npm start
```

## 📜 Complete Audit & Fixes
The project has undergone a professional architecture audit and all 13 critical/important issues have been resolved.

## 🚀 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod (Request & Environment Validation)
- **Security**: JWT Authentication, bcryptjs hashing, Express Rate Limit, CORS
- **Architecture**: Controller-Service-Model

## 🛠️ Features

- **RBAC**: Statement-based access control with three roles: `viewer`, `analyst`, and `admin`.
- **User Management**: Comprehensive CRUD for users with account activation/deactivation.
- **Transaction Management**: Detailed income and expense tracking with category and date filters.
- **Dashboard Analytics**:
  - Financial Summary: Total income, expenses, and net balance.
  - Category Breakdown: Distribution of finances across categories.
  - Trends: Monthly financial activity over time.
  - Recent Activity: Tracking the latest 10 transactions.

## 📋 Role Permissions

| Resource | Action | Viewer | Analyst | Admin |
| :--- | :--- | :---: | :---: | :---: |
| **Transactions** | Read | ✅ | ✅ | ✅ |
| | Create/Update/Delete | ❌ | ❌ | ✅ |
| **Users** | Read | ❌ | ✅ | ✅ |
| | Update/Status/Delete | ❌ | ❌ | ✅ |
| **Dashboard** | Read | ✅ | ✅ | ✅ |

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/deveshcse/finance-data-processing-backend-assignment.git
cd finance-data-processing-backend-assignment
```

### 2. Environment Variables
Create a `.env` file in the root directory based on the provided [.env.example](.env.example):
```bash
cp .env.example .env
```
Ensure you update the `MONGODB_URI` and generate secure random strings for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

### 3. Installation
```bash
npm install
```

### 4. Run the Application
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. API Documentation (Swagger)
Once the server is running, you can access the interactive API documentation at:
**`http://localhost:5000/api-docs`**

Use the **Authorize** button to provide your Bearer Token after logging in to test protected routes.

## 🔌 API Documentation Summary

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate and get JWT

### Users (Admin/Analyst only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `PATCH /api/users/:id` - Update user details (Admin)
- `PATCH /api/users/:id/status` - Toggle active status (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Transactions
- `POST /api/transactions` - Create transaction (Admin)
- `GET /api/transactions` - List with filters: `type`, `category`, `startDate`, `endDate` (All Roles)
- `GET /api/transactions/:id` - Get specific transaction (All Roles)
- `PATCH /api/transactions/:id` - Update details (Admin)
- `DELETE /api/transactions/:id` - Remove transaction (Admin)

### Dashboard (All roles)
- `GET /api/dashboard/summary` - Total income, expenses, and balance
- `GET /api/dashboard/categories` - Totals grouped by category
- `GET /api/dashboard/trends` - Monthly income/expense data
- `GET /api/dashboard/recent` - Latest 10 transactions

## 🧠 Assumptions Made

1. **Fixed Role Hierarchy**: The system assumes three primary roles (`viewer`, `analyst`, `admin`) which are strictly enforced and sufficient for the current business logic. Users cannot have multiple overlapping roles.
2. **Soft Deletion**: For audit purposes, users are assumed to be "soft deactivated" via an `isActive` flag rather than hard-deleted from the database in most typical workflows.
3. **Single Currency**: All financial transactions are assumed to be recorded in a single, base currency. Currency conversion or multi-currency support is omitted for simplicity.
4. **Timezones**: Dates are stored in UTC format, and it is assumed that the client frontend will handle proper timezone localization for display on the dashboard.

## ⚖️ Tradeoffs Considered

1. **Hybrid Authentication Strategy (Stateless Access + Stateful Refresh)**
   - *Tradeoff*: We use short-lived, stateless JWT Access Tokens alongside long-lived, database-backed (hashed) Refresh Tokens.
   - *Reasoning*: Stateless access tokens ensure high scalability and fast verifications for most requests without database lookups. The database-backed refresh tokens allow us to still maintain control (e.g., revoking compromised sessions instantly upon refresh attempts) at the minor cost of a database query during the refresh cycle.
2. **MongoDB vs SQL**
   - *Tradeoff*: Used MongoDB for rapid iteration and flexible document schemas, over a strictly relational SQL database.
   - *Reasoning*: The dashboard aggregations map beautifully to MongoDB's Aggregation Pipeline, although we trade away strict SQL-style ACID transactions across complex relations.
3. **Monolithic Backend Design**
   - *Tradeoff*: The service is built as a single Node.js/Express monolith instead of microservices.
   - *Reasoning*: Reduces operational complexity and deployment overhead for a dashboard application, ensuring easier maintenance for the team without the immediate need for independent scaling of microservices.
4. **Zod Validation Over Mongoose Built-in Validation**
   - *Tradeoff*: We validate incoming requests structurally at the middleware level using Zod before they hit the controllers, alongside Mongoose schema validation.
   - *Reasoning*: Adds a small step in the request lifecycle, but provides extremely robust, type-safe error messages and prevents bad data from ever reaching the service layer.

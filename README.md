# Finance Dashboard Backend
A robust backend system for a Finance Dashboard, featuring Role-Based Access Control (RBAC), transaction tracking, and financial analytics.

## 🚀 Deployment

The project is production-ready with a Dockerfile and environment-aware configuration.

### 1. Environment Checklist (Production)
Ensure these are set in your cloud provider:
- `MONGODB_URI`: Production MongoDB Atlas string.
- `JWT_ACCESS_SECRET`: A long, random string.
- `JWT_REFRESH_SECRET`: A different long, random string.
- `SERVER_URL`: Your deployed API URL (e.g., `https://api.yourdomain.com`).
- `CORS_ORIGINS`: Comma-separated list of allowed frontends.
- `NODE_ENV`: `production`

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

### 1. Environment Variables
Create a `.env` file in the root directory based on [.env.example](.env.example):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 2. Installation
```bash
npm install
```

### 3. Run the Application
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 4. API Documentation (Swagger)
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

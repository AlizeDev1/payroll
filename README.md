# Alize Enterprise Payroll & HRMS Platform

Enterprise Payroll & HRMS Software engineered for Indian statutory compliance (EPFO ECR, ESIC, Professional Tax, TDS Section 192 under Old/New Regime 115BAC, Gratuity, Full & Final settlements, and Contractor TDS 194C/194J).

---

## 🏛️ Architecture & Folder Structure

The repository is structured into a clean **Fullstack Monorepo** separating the presentation and API server layers:

```
Payroll/
├── frontend/                   # 🎨 Frontend Web Application (React 19 + Vite 8 + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI components & modals (PayslipModal, ECRModal, etc.)
│   │   ├── pages/              # 23 View Pages (Dashboard, Employees, Payroll, Payslips, etc.)
│   │   ├── services/           # API Client & service abstraction layer
│   │   ├── context/            # Auth, Theme, and Toast React Context providers
│   │   ├── data/               # Seed & mock fixtures for standalone testing
│   │   ├── types/              # Comprehensive TypeScript interfaces & domain types
│   │   ├── utils/              # Calculation helpers & formatters
│   │   ├── App.tsx             # Root router & layout mounting
│   │   ├── main.tsx            # React application entrypoint
│   │   └── index.css           # Tailwind v4 utility styles
│   ├── public/                 # Static brand assets & illustrations
│   ├── .env                    # Frontend environment configuration
│   ├── tsconfig.json           # Frontend TypeScript configuration
│   ├── vite.config.ts          # Vite build config with reverse proxy to :8000
│   └── package.json            # Frontend-specific dependencies
│
├── backend/                    # ⚡ Backend REST API Server (Node.js + Express + Prisma ORM)
│   ├── prisma/
│   │   ├── schema.prisma       # 16 Relational Models (User, Employee, PayrollRun, etc.)
│   │   └── dev.db              # SQLite development database
│   ├── src/
│   │   ├── routes/             # REST endpoints (/auth, /employees, /payroll, /compliance, etc.)
│   │   ├── data/               # Backend data fixtures for database seeding
│   │   ├── db.ts               # PrismaClient database connection singleton
│   │   ├── seed.ts             # Automated enterprise database seeder
│   │   └── index.ts            # Express server initialization, middlewares, & routing
│   ├── .env                    # Backend environment configuration
│   ├── tsconfig.json           # Backend TypeScript configuration
│   └── package.json            # Backend-specific dependencies
│
├── package.json                # Root orchestration scripts (concurrent runner)
├── .gitignore                  # Git ignore rules for monorepo
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start for Developers

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+

### 2. Install All Dependencies
Install root, frontend, and backend packages in one step:
```bash
npm run install:all
```

### 3. Run Development Environment
Starts both the **Backend API Server (:8000)** and the **Frontend Client (:3000)** concurrently with live hot-reloading:
```bash
npm run dev
```

- **Frontend URL**: `http://localhost:3000`
- **Backend API URL**: `http://localhost:8000/api/v1`
- **API Health Check**: `http://localhost:8000/health`

---

## 📦 Dedicated Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs backend (:8000) and frontend (:3000) concurrently |
| `npm run dev:frontend` | Runs only the frontend Vite development server |
| `npm run dev:backend` | Runs only the backend Express server with `tsx watch` |
| `npm run build` | Builds both frontend bundle and backend TypeScript |
| `npm run lint` | Performs strict TypeScript type checks across both projects |
| `npm run prisma:seed` | Seeds the backend database with fresh enterprise test data |
| `npm run prisma:studio` | Opens Prisma Studio web UI for database inspection |
| `npm run prisma:generate` | Re-generates the Prisma Client after schema changes |

---

## 🔐 Default Credentials (Dev / Demo)

- **Admin Email**: `admin@alize.com`
- **Default Password**: `admin123`
- **Role**: `Company Admin`

---

## 📡 API Routing Overview

All backend endpoints are prefixed under `/api/v1`:

- `/api/v1/auth` - Login and session verification (`/login`, `/me`)
- `/api/v1/employees` - Employee CRUD, profiles, bank details, departments, designations
- `/api/v1/payroll` - Monthly payroll runs, item records, payslip records, salary structures
- `/api/v1/attendance` - Attendance logs, daily check-in/out, monthly muster roll
- `/api/v1/leaves` - Leave requests, balance tracking, approvals
- `/api/v1/reimbursements` - Expense claim submissions and finance approvals
- `/api/v1/contractors` - Freelancers/contractors directory and invoice processing (194C/194J)
- `/api/v1/compliance` - Tax declarations (80C/80D), statutory compliance summaries, F&F settlements
- `/api/v1/loans` - Employee salary advances and loan EMI schedules
- `/api/v1/users` - Admin user accounts and role-based permissions matrix
- `/api/v1/documents` - Corporate policies and employee document storage

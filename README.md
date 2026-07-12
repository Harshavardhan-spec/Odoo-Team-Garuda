# TransitOps – Smart Transport Operations Platform

TransitOps is an enterprise-grade Transport Operations ERP platform designed to manage Vehicles, Drivers, Trips, Maintenance logs, Fuel tracking, Expenses, and Analytics. This repository contains the complete modular blueprint to support parallel development across a team of four software engineers.

---

## 🏗️ Architecture Design

The platform uses a modular, scalable architecture inspired by production ERP software:

### Backend (FastAPI + SQLAlchemy 2.0 + Alembic + PostgreSQL)
- **Modular Layout**: All operational boundaries (Vehicles, Drivers, Trips, etc.) are separated into independent domain modules across the models, schemas, routers, and services layer.
- **Service Layer Pattern**: Mediates transactions between raw API endpoints and database access layers to ensure testability and isolate business rules.
- **Repository/CRUD Base Pattern**: A generic database access layer reduces boilerplate and accelerates model implementation.
- **RBAC & Security**: Integrated JWT verification and access control policies checking resource authorization thresholds dynamically.

### Frontend (React + Vite + TailwindCSS)
- **Component isolation**: Fully decoupled layout view blocks, global contexts (Auth), utility formatters, and service clients.
- **Axios Interceptor Interlocks**: Automatic injection of Authorization headers and automatic session termination on unauthorized errors.
- **Tailwind Grid theme**: Customized styles with smooth gradients, dark mode parameters, and responsive sidebar.

---

## 📂 Project Structure

```text
Odoo-Team-Garuda/
├── backend/
│   ├── alembic/                  # Database schema migrations
│   │   ├── versions/             # Migration files
│   │   └── env.py                # Alembic environment hook
│   ├── app/
│   │   ├── api/                  # API endpoints and routers
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/    # Feature routers (auth, vehicles, trips, etc.)
│   │   │   │   └── router.py     # Main router grouping endpoints
│   │   │   └── deps.py           # Dependency injection (DB session, auth checks)
│   │   ├── core/                 # Configuration, exception handling, logging
│   │   ├── crud/                 # CRUD classes (base helper and specific queries)
│   │   ├── models/               # SQLAlchemy Declarative models
│   │   ├── schemas/              # Pydantic schemas (DTO validation)
│   │   ├── services/             # Core business logic layer placeholders
│   │   └── main.py               # FastAPI entrypoint
│   ├── alembic.ini               # Alembic config
│   ├── requirements.txt          # Python package requirements
│   └── .env.example              # Env configuration template
├── frontend/
│   ├── src/
│   │   ├── components/           # Generic reusable UI (Button, Card, Table, etc.)
│   │   ├── context/              # Auth context for JWT session handling
│   │   ├── hooks/                # Custom hooks (useAuth, useAxios)
│   │   ├── layouts/              # Theme layouts (MainLayout, AuthLayout)
│   │   ├── pages/                # Operational view pages
│   │   ├── services/             # Endpoint HTTP request wrappers
│   │   ├── utils/                # Standard formatters and validators
│   │   ├── App.jsx               # App routing configuration
│   │   └── main.jsx              # React index mounting
│   ├── tailwind.config.js        # TailwindCSS configurations
│   ├── vite.config.js            # Vite configurations
│   └── .env.example              # Frontend config template
├── docker-compose.yml            # Multi-service container orchestrator
└── README.md                     # Documentation
```

---

## ⚡ Quick Start (Docker Compose)

The easiest way to spin up the entire stack (Database, Backend, Frontend) with hot-reloading enabled is using Docker Compose:

1. **Clone and Configure Environment Files**
   Make copies of `.env.example` in both folders:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Run Services**
   ```bash
   docker compose up --build
   ```

3. **Port mappings**:
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:8000`
   - **OpenAPI Swagger**: `http://localhost:8000/api/v1/docs`
   - **Database**: Port `5432`

---

## 🛠️ Local Installation (Without Docker)

### Backend Setup

1. **Navigate & Create Virtual Environment**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Update `backend/.env` with your local PostgreSQL parameters.

4. **Run Database Migrations (Alembic)**:
   ```bash
   # Generate initial migration script
   alembic revision --autogenerate -m "initial_schema"
   
   # Apply migration to database
   alembic upgrade head
   ```

5. **Start FastAPI Dev Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate & Install NPM Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

---

## 🧑‍💻 Developer Guide: Parallel Workflows

To support four developers working in parallel without merge conflicts, follow this feature separation guide:

### Developer 1: Authentication & User Accounts (User, Role)
- **API File**: [api/v1/endpoints/users.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/users.py) & [auth.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/auth.py)
- **Services File**: [services/user.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/services/user.py)
- **Frontend File**: [context/AuthContext.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/context/AuthContext.jsx) & [pages/Login.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Login.jsx)
- **Focus**: Wire real JWT validations, hashing, login actions, and user roles logic.

### Developer 2: Dispatch & Trip Tracking (Vehicles, Drivers, Trips)
- **API File**: [endpoints/vehicles.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/vehicles.py), [drivers.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/drivers.py), & [trips.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/trips.py)
- **Services File**: [services/trip.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/services/trip.py)
- **Frontend Pages**: [pages/Vehicles.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Vehicles.jsx), [Drivers.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Drivers.jsx), [Trips.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Trips.jsx)
- **Focus**: Vehicle registries, driver allocations, trip schedules, and location transitions.

### Developer 3: Maintenance & Mechanical Safety (MaintenanceLog, FuelLog)
- **API File**: [endpoints/maintenance.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/maintenance.py) & [fuel.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/fuel.py)
- **Services File**: [services/maintenance.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/services/maintenance.py)
- **Frontend Pages**: [pages/Maintenance.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Maintenance.jsx), [Fuel.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Fuel.jsx)
- **Focus**: Log oil checks, brake inspections, refueling cost reports, and fuel efficiency metrics.

### Developer 4: Financial Auditing & Dashboard (Expense, User Roles)
- **API File**: [endpoints/expenses.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/api/v1/endpoints/expenses.py)
- **Services File**: [services/expense.py](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/backend/app/services/expense.py)
- **Frontend Pages**: [pages/Expenses.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Expenses.jsx) & [pages/Dashboard.jsx](file:///Users/ashu/Documents/VMEG/Hackathons/ODOO/Code/Odoo-Team-Garuda/frontend/src/pages/Dashboard.jsx)
- **Focus**: Fuel/maintenance expense logs, manager approval routes, metrics calculations, and dashboard layout summaries.
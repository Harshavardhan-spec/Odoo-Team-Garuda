# Garuda Fleet Erp – Smart Transport Operations Platform

Garuda Fleet Erp is an enterprise-grade Transport Operations ERP platform designed to manage vehicle registries, driver compliance, trip schedules, maintenance tasks, fuel usage logs, and operational expenses in one unified system.

---

## Overview

Garuda Fleet Erp solves the operational inefficiencies of manual and fragmented logistics management by digitizing key transport processes:

- **Vehicle Registry**: Fleet registry management tracking capacity parameters and real-time operational status.
- **Driver Management**: Operator records keeping track of active licensing and availability.
- **Trip Management**: Route coordination, cargo assignments, and real-time dispatch tracking.
- **Maintenance**: Logging mechanical issues, service schedules, and repair history.
- **Fuel Logs**: Fuel efficiency analysis, consumption tracking, and fill-up records.
- **Expenses**: Comprehensive operational cost management with approval limits.
- **Analytics**: Fleet operations and financial cost aggregation.

---

## Tech Stack

### Frontend
- **React**: Component-based UI library.
- **Vite**: High-performance frontend build tool.
- **Tailwind CSS**: Utility-first CSS styling.
- **React Router**: Client-side routing.
- **Axios**: HTTP client with request interceptors.

### Backend
- **Django**: Robust web framework.
- **Django REST Framework**: REST API toolkit.

### Database
- **PostgreSQL**: Relational database.

### Authentication
- **Django Authentication**: User security and access controls.
- **JWT**: Secure token-based session handling.

### Version Control
- **Git**: Version control.
- **GitHub**: Project hosting and collaboration.

---

## Project Architecture

Garuda Fleet Erp is built using a modular ERP architecture. The backend contains isolated Django apps representing distinct operational domains (e.g., vehicles, drivers, trips, maintenance). The backend exposes clean REST APIs consumed by corresponding React services and page layouts on the frontend. This decoupling minimizes cross-module dependencies and supports parallel development.

---

## Project Structure

```text
backend/
├── config/
├── authentication/
├── vehicles/
├── drivers/
├── trips/
├── maintenance/
├── fuel/
├── expenses/
├── dashboard/
├── reports/
├── manage.py
└── requirements.txt

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── routes/
│   └── assets/

README.md
docs/
```

---

## Core Modules

- **Authentication**: Handles secure user registration, login, and JWT emission.
- **Vehicle Management**: Maintains vehicle physical records, status, and capacities.
- **Driver Management**: Tracks driver compliance records, licenses, and shifts.
- **Trip Management**: Coordinates route dispatch details, cargo weights, and trip state transitions.
- **Maintenance**: Logs maintenance events, mechanical services, and scheduling.
- **Fuel Management**: Monitors vehicle fuel logs, odometer changes, and fuel costs.
- **Expense Management**: Categorizes operational costs and manages expense approvals.
- **Dashboard**: Consolidates interactive metrics and operational fleet widgets.
- **Reports**: Generates summaries of costs, fuel, and trip efficiency.

---

## User Roles

- **Fleet Manager**: Manages vehicles, reviews dashboard performance, and reviews high-value expense submissions.
- **Dispatcher**: Registers trips, routes cargo, and coordinates driver-vehicle availability checks.
- **Safety Officer**: Audits driver licensing status, monitors expired certifications, and schedules mechanical inspections.
- **Financial Analyst**: Evaluates operational and fuel costs, processes expenses, and reviews expense trends.

---

## Business Rules

Garuda Fleet Erp enforces the following key operational constraints:

- **Unique Vehicle Registrations**: Every vehicle must have a unique license plate/registration number.
- **Unique Driver Licensing**: Driver license numbers must be unique across the driver registry.
- **Operational Availability during Maintenance**: Vehicles currently undergoing maintenance cannot be dispatched or assigned to active trips.
- **Driver License Compliance**: Drivers with expired licenses cannot be assigned to any trip.
- **Single Active Assignment**: A driver cannot be assigned to multiple active trips concurrently.
- **Weight Limit Enforcement**: Cargo payload weight must not exceed the vehicle's maximum carrying capacity.
- **Status Restoration**: Completing a trip automatically restores both the vehicle's status and the driver's status to "Available".
- **Maintenance Status Updates**: Commencing a maintenance session automatically changes the vehicle's status to "Maintenance".
- **Maintenance Resolution**: Completing a maintenance log restores the vehicle's status to "Available".
- **Odometer Sequence Check**: Odometer readings on fuel logs and maintenance logs must be greater than or equal to the current recorded mileage of the vehicle.
- **Financial Controls**: High-value expenses must go through an approval workflow and receive authorization from a Fleet Manager.

---

## Backend Setup

To set up and run the backend locally, execute the following commands in the `backend/` directory:

1. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment**:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows (Command Prompt):
     ```cmd
     venv\Scripts\activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply database migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Start the development server**:
   ```bash
   python manage.py runserver
   ```

---

## Frontend Setup

To set up and run the frontend locally, execute the following commands in the `frontend/` directory:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## Git Workflow

The project uses branch segmentation for clean collaborative features integration:

```text
main (Production-ready stable code)
  ↓
develop (Integration environment branch)
  ↓
feature/<module> (Feature branches per developer assignment)
```

- Developer works on domain-specific branches (e.g., `feature/trips`, `feature/authentication`).
- Pull requests are targeting the `develop` branch for integration testing.
- Verified changes are merged into the `main` branch.

---

## Development Guidelines

- **Modular Architecture**: Design code domains separately to prevent high coupling.
- **REST APIs**: Design clean REST resources with unified JSON responses and appropriate status codes.
- **Meaningful Commits**: Write informative commit logs summarizing change contexts.
- **No Hardcoded Data**: Externalize API endpoints, ports, and configuration keys to environment files.
- **Validate Business Rules**: Validate logic both on the frontend interface and at the backend database/service layers.
- **Keep Modules Independent**: Avoid direct modules cross-importing where possible.
- **Clean Code**: Write readable, well-commented code following team conventions.
- **Follow SOLID Principles**: Write extensible, single-responsibility components and functions.

---

## Documentation

Detailed documentation is stored in the `docs/` folder:

- **API_CONTRACT.md**: Outlines endpoint signatures, request structures, and response JSON formats.
- **DATABASE_SCHEMA.md**: Explains PostgreSQL tables, schemas, relations, and index choices.
- **BUSINESS_RULES.md**: Details specific compliance rules and validation workflows.
- **TEAM_ASSIGNMENTS.md**: Outlines modules assignments and developer responsibilities.
- **IMPLEMENTATION_LOGS/**: Contains dev journals recording implementation steps and architectural decisions.

---

## Team

- **Team Garuda**
- **Odoo Hiring Hackathon**
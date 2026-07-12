# TransitOps API Contract

This document serves as the single source of truth for all API contracts between the frontend and backend developers of the TransitOps platform.

---

## Global Standards

### Error Response Format
All error responses from any API endpoint must follow this standardized JSON schema:
```json
{
  "success": false,
  "message": "Error description message.",
  "errors": {
    "field_name": ["Specific validation error message."]
  }
}
```

### Success Response Format
All successful responses must wrap their payload under the `data` key:
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

## Module: Authentication

### Endpoint: `POST /api/auth/login`
- **Method**: `POST`
- **Purpose**: Authenticate user credentials and return a JSON Web Token (JWT).
- **Authentication Required**: No
- **Allowed Roles**: All users
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "email": "user@transitops.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Authentication successful.",
      "data": {
        "access": "eyJhbGciOi...",
        "refresh": "eyJhbGciOi...",
        "user": {
          "id": 1,
          "email": "user@transitops.com",
          "first_name": "John",
          "last_name": "Doe",
          "role": "Fleet Manager"
        }
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Missing fields)
  - **Status Code**: `401 Unauthorized` (Invalid credentials)
- **Business Rules**: None
- **Notes**: Returns short-lived access and long-lived refresh tokens.

---

### Endpoint: `POST /api/auth/logout`
- **Method**: `POST`
- **Purpose**: Invalidate the current session / blacklist the JWT refresh token.
- **Authentication Required**: Yes
- **Allowed Roles**: All authenticated users
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "refresh": "eyJhbGciOi..."
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Logged out successfully.",
      "data": {}
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Missing or invalid refresh token)
- **Business Rules**: None
- **Notes**: Destroys/blacklists the token in the session database.

---

### Endpoint: `GET /api/auth/me`
- **Method**: `GET`
- **Purpose**: Retrieve detailed profile information for the currently authenticated user.
- **Authentication Required**: Yes
- **Allowed Roles**: All authenticated users
- **Request Parameters**: None
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "User profile retrieved successfully.",
      "data": {
        "id": 1,
        "email": "user@transitops.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "Fleet Manager"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized` (Expired or invalid token)
- **Business Rules**: None
- **Notes**: Used to restore frontend session state on app load.

---

## Module: Vehicles

### Endpoint: `GET /api/vehicles`
- **Method**: `GET`
- **Purpose**: Retrieve a list of all registered vehicles with optional filtering.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Dispatcher`, `Safety Officer`, `Financial Analyst`
- **Request Parameters**:
  - `status` (Query string, optional: e.g. `Available`, `Maintenance`, `On Trip`, `Out of Service`)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Vehicles list retrieved.",
      "data": [
        {
          "id": 10,
          "registration_number": "TX-9988-AB",
          "make": "Volvo",
          "model": "VNL 860",
          "year": 2022,
          "capacity_kg": 25000.0,
          "status": "Available",
          "current_location": "Main Depot"
        }
      ]
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized`
- **Business Rules**: None
- **Notes**: Supports standard pagination headers.

---

### Endpoint: `GET /api/vehicles/{id}`
- **Method**: `GET`
- **Purpose**: Retrieve detailed information for a specific vehicle.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Dispatcher`, `Safety Officer`, `Financial Analyst`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Vehicle details retrieved.",
      "data": {
        "id": 10,
        "registration_number": "TX-9988-AB",
        "make": "Volvo",
        "model": "VNL 860",
        "year": 2022,
        "capacity_kg": 25000.0,
        "status": "Available",
        "current_location": "Main Depot",
        "created_at": "2026-07-12T10:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `404 Not Found` (Vehicle doesn't exist)
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `POST /api/vehicles`
- **Method**: `POST`
- **Purpose**: Add a new vehicle to the registry.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "registration_number": "TX-9988-AB",
    "make": "Volvo",
    "model": "VNL 860",
    "year": 2022,
    "capacity_kg": 25000.0,
    "status": "Available",
    "current_location": "Main Depot"
  }
  ```
- **Success Response**:
  - **Status Code**: `201 Created`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Vehicle registered successfully.",
      "data": {
        "id": 10,
        "registration_number": "TX-9988-AB",
        "make": "Volvo",
        "model": "VNL 860",
        "year": 2022,
        "capacity_kg": 25000.0,
        "status": "Available",
        "current_location": "Main Depot"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Validation errors or duplicate registration number)
- **Business Rules**:
  - **Unique Registration Number**: The `registration_number` must be unique across the fleet database.
- **Notes**: None

---

### Endpoint: `PUT /api/vehicles/{id}`
- **Method**: `PUT`
- **Purpose**: Update specifications or status details of a vehicle.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Safety Officer` (for status updates to Maintenance)
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**:
  ```json
  {
    "registration_number": "TX-9988-AB",
    "make": "Volvo",
    "model": "VNL 860",
    "year": 2022,
    "capacity_kg": 25000.0,
    "status": "Maintenance",
    "current_location": "East Service Center"
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Vehicle updated successfully.",
      "data": {
        "id": 10,
        "registration_number": "TX-9988-AB",
        "make": "Volvo",
        "model": "VNL 860",
        "year": 2022,
        "capacity_kg": 25000.0,
        "status": "Maintenance",
        "current_location": "East Service Center"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Duplicate registration number or validation error)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **Unique Registration Number**: If registration number is changed, it must be unique.
- **Notes**: None

---

### Endpoint: `DELETE /api/vehicles/{id}`
- **Method**: `DELETE`
- **Purpose**: Delete/retire a vehicle from the active registry.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Vehicle deleted successfully.",
      "data": {}
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Vehicle is on an active trip)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **No Delete on Active Trip**: Cannot delete a vehicle whose current status is "On Trip" or has active trips assigned.
- **Notes**: Usually marks the vehicle status as "Retired" rather than hard deletion to maintain trip ledger integrity.

---

## Module: Drivers

### Endpoint: `GET /api/drivers`
- **Method**: `GET`
- **Purpose**: Get all drivers.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Dispatcher`, `Safety Officer`
- **Request Parameters**:
  - `status` (Query string, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Drivers retrieved.",
      "data": [
        {
          "id": 5,
          "name": "Jane Smith",
          "license_number": "DL-12948-Z",
          "license_expiry": "2028-09-12",
          "phone_number": "+1234567890",
          "status": "Available"
        }
      ]
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `GET /api/drivers/{id}`
- **Method**: `GET`
- **Purpose**: Get specific driver profile.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Dispatcher`, `Safety Officer`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Driver details retrieved.",
      "data": {
        "id": 5,
        "name": "Jane Smith",
        "license_number": "DL-12948-Z",
        "license_expiry": "2028-09-12",
        "phone_number": "+1234567890",
        "status": "Available"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `404 Not Found`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `POST /api/drivers`
- **Method**: `POST`
- **Purpose**: Register a new driver.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Safety Officer`
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "license_number": "DL-12948-Z",
    "license_expiry": "2028-09-12",
    "phone_number": "+1234567890",
    "status": "Available"
  }
  ```
- **Success Response**:
  - **Status Code**: `201 Created`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Driver registered successfully.",
      "data": {
        "id": 5,
        "name": "Jane Smith",
        "license_number": "DL-12948-Z",
        "license_expiry": "2028-09-12",
        "phone_number": "+1234567890",
        "status": "Available"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Duplicate license number or invalid phone number)
- **Business Rules**:
  - **Unique Driver Licensing**: `license_number` must be unique across the driver registry database.
- **Notes**: None

---

### Endpoint: `PUT /api/drivers/{id}`
- **Method**: `PUT`
- **Purpose**: Update driver records.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Safety Officer`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "license_number": "DL-12948-Z",
    "license_expiry": "2028-09-12",
    "phone_number": "+1999999999",
    "status": "Available"
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Driver updated successfully.",
      "data": {
        "id": 5,
        "name": "Jane Smith",
        "license_number": "DL-12948-Z",
        "license_expiry": "2028-09-12",
        "phone_number": "+1999999999",
        "status": "Available"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Invalid inputs)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **Unique Driver Licensing**: If updated, `license_number` must be unique.
- **Notes**: None

---

### Endpoint: `DELETE /api/drivers/{id}`
- **Method**: `DELETE`
- **Purpose**: Delete a driver registry entry.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Driver deleted successfully.",
      "data": {}
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Driver currently assigned to active trip)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **No Delete on Active Trip**: Drivers assigned to a trip with "Dispatched" status cannot be deleted.
- **Notes**: Usually marks the driver status as "Inactive" or "Retired".

---

## Module: Trips

### Endpoint: `GET /api/trips`
- **Method**: `GET`
- **Purpose**: Get all trips.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Dispatcher`, `Financial Analyst`
- **Request Parameters**:
  - `status` (Query string, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trips list retrieved.",
      "data": [
        {
          "id": 42,
          "vehicle": 10,
          "driver": 5,
          "cargo_weight_kg": 12000.0,
          "origin": "Depot A",
          "destination": "Depot B",
          "status": "Draft",
          "start_time": "2026-07-13T08:00:00Z",
          "end_time": null
        }
      ]
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `GET /api/trips/{id}`
- **Method**: `GET`
- **Purpose**: Get trip details.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Dispatcher`, `Financial Analyst`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trip details retrieved.",
      "data": {
        "id": 42,
        "vehicle": 10,
        "driver": 5,
        "cargo_weight_kg": 12000.0,
        "origin": "Depot A",
        "destination": "Depot B",
        "status": "Draft",
        "start_time": "2026-07-13T08:00:00Z",
        "end_time": null
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `404 Not Found`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `POST /api/trips`
- **Method**: `POST`
- **Purpose**: Create a new draft trip.
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`, `Fleet Manager`
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "driver": 5,
    "cargo_weight_kg": 12000.0,
    "origin": "Depot A",
    "destination": "Depot B",
    "start_time": "2026-07-13T08:00:00Z"
  }
  ```
- **Success Response**:
  - **Status Code**: `201 Created`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trip created in Draft status.",
      "data": {
        "id": 42,
        "vehicle": 10,
        "driver": 5,
        "cargo_weight_kg": 12000.0,
        "origin": "Depot A",
        "destination": "Depot B",
        "status": "Draft",
        "start_time": "2026-07-13T08:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Weight limits, license validation, or status conflict)
- **Business Rules**:
  - **Driver License Expiry**: Driver's license must not be expired (`license_expiry` must be in the future).
  - **Weight Limit Check**: Cargo weight must be less than or equal to the selected vehicle's `capacity_kg`.
- **Notes**: Trip starts in `Draft` state. Driver and vehicle allocation checks are made at creation, but state changes occur during dispatch.

---

### Endpoint: `PUT /api/trips/{id}`
- **Method**: `PUT`
- **Purpose**: Modify trip settings (allowed only if the status is `Draft`).
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`, `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "driver": 5,
    "cargo_weight_kg": 15000.0,
    "origin": "Depot A",
    "destination": "Depot C",
    "start_time": "2026-07-13T09:00:00Z"
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trip draft modified.",
      "data": {
        "id": 42,
        "vehicle": 10,
        "driver": 5,
        "cargo_weight_kg": 15000.0,
        "origin": "Depot A",
        "destination": "Depot C",
        "status": "Draft"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Validation errors, or trying to modify a dispatched/completed trip)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **Draft Only Updates**: Updates are forbidden if current status is not `Draft`.
  - **Weight limits & Driver checks**: Enforces the same capacity limits and driver license checks.
- **Notes**: None

---

### Endpoint: `DELETE /api/trips/{id}`
- **Method**: `DELETE`
- **Purpose**: Delete a draft trip.
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`, `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trip draft deleted.",
      "data": {}
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Trip has already been dispatched/completed)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **Delete Allowed for Draft Only**: Active/dispatched/completed trips cannot be deleted.
- **Notes**: None

---

### Endpoint: `POST /api/trips/{id}/dispatch`
- **Method**: `POST`
- **Purpose**: Dispatch the trip. Transition status from `Draft` to `Dispatched`.
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trip dispatched successfully.",
      "data": {
        "id": 42,
        "status": "Dispatched",
        "dispatched_at": "2026-07-12T12:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Vehicle/Driver not available, expired license, status sequence check failed)
- **Business Rules**:
  - **Status Flow validation**: Trip state can only move: `Draft` → `Dispatched`.
  - **Vehicle Dispatch Availability**: Vehicle must be in `Available` status. Vehicle in `Maintenance` or `Out of Service` or `On Trip` status cannot dispatch.
  - **Driver Dispatch Availability**: Driver must be in `Available` status. Driver already assigned to another active trip or marked inactive cannot dispatch.
  - **Driver License Validation**: License must not be expired at dispatch time.
  - **State Lock**: Once dispatched, the assigned Vehicle status changes to `On Trip`, and the Driver status changes to `On Trip`.
- **Notes**: Triggering this locks resource states.

---

### Endpoint: `POST /api/trips/{id}/complete`
- **Method**: `POST`
- **Purpose**: Complete the trip. Transition status from `Dispatched` to `Completed`.
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**:
  ```json
  {
    "end_time": "2026-07-12T15:30:00Z",
    "actual_distance_km": 340.5
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trip completed.",
      "data": {
        "id": 42,
        "status": "Completed",
        "end_time": "2026-07-12T15:30:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Trip not dispatched, or end_time precedes start_time)
- **Business Rules**:
  - **Status Flow validation**: Trip state can only move: `Dispatched` → `Completed`.
  - **Resource Restoration**: Completing a trip automatically restores both the vehicle's status and the driver's status back to `Available`.
- **Notes**: None

---

### Endpoint: `POST /api/trips/{id}/cancel`
- **Method**: `POST`
- **Purpose**: Cancel a trip. Transition status to `Cancelled`.
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`, `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Trip cancelled.",
      "data": {
        "id": 42,
        "status": "Cancelled"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Trip has already been dispatched/completed)
- **Business Rules**:
  - **Cancellation Rule**: A trip can only be cancelled before it is dispatched (i.e. while in `Draft` state).
- **Notes**: Releases any initial vehicle/driver holds immediately.

---

## Module: Maintenance

### Endpoint: `GET /api/maintenance`
- **Method**: `GET`
- **Purpose**: List maintenance logs.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Safety Officer`, `Financial Analyst`
- **Request Parameters**:
  - `vehicle` (Query string, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Maintenance logs retrieved.",
      "data": [
        {
          "id": 14,
          "vehicle": 10,
          "description": "Brake Replacement",
          "start_date": "2026-07-12",
          "end_date": null,
          "cost": 450.00,
          "status": "In Progress"
        }
      ]
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `POST /api/maintenance`
- **Method**: `POST`
- **Purpose**: Log a new maintenance event.
- **Authentication Required**: Yes
- **Allowed Roles**: `Safety Officer`, `Fleet Manager`
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "description": "Brake Replacement",
    "start_date": "2026-07-12",
    "cost": 450.00,
    "status": "In Progress"
  }
  ```
- **Success Response**:
  - **Status Code**: `201 Created`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Maintenance log created.",
      "data": {
        "id": 14,
        "vehicle": 10,
        "description": "Brake Replacement",
        "start_date": "2026-07-12",
        "cost": 450.00,
        "status": "In Progress"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Vehicle is on a trip or not found)
- **Business Rules**:
  - **Maintenance Status Shift**: Creating/starting an in-progress maintenance entry changes the associated vehicle's status to `Maintenance`.
  - **No Maintenance for active vehicles**: Cannot schedule maintenance for vehicles currently "On Trip".
- **Notes**: Triggers vehicle state lock.

---

### Endpoint: `PUT /api/maintenance/{id}`
- **Method**: `PUT`
- **Purpose**: Modify maintenance records or close a maintenance task.
- **Authentication Required**: Yes
- **Allowed Roles**: `Safety Officer`, `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "description": "Brake Replacement",
    "start_date": "2026-07-12",
    "end_date": "2026-07-12",
    "cost": 450.00,
    "status": "Completed"
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Maintenance log updated successfully.",
      "data": {
        "id": 14,
        "vehicle": 10,
        "status": "Completed",
        "end_date": "2026-07-12"
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (End date preceding start date)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **Closing maintenance changes vehicle status**: Transitioning status to `Completed` automatically changes the associated vehicle's status back to `Available`.
- **Notes**: Release locks on status change.

---

### Endpoint: `DELETE /api/maintenance/{id}`
- **Method**: `DELETE`
- **Purpose**: Remove a maintenance log.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Maintenance log deleted.",
      "data": {}
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Maintenance is active)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **No delete on active Maintenance**: Cannot delete a log in `In Progress` status if the vehicle status is still `Maintenance` without resolving status first.
- **Notes**: None

---

## Module: Fuel Logs

### Endpoint: `GET /api/fuel`
- **Method**: `GET`
- **Purpose**: Get all fuel consumption logs.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Financial Analyst`
- **Request Parameters**:
  - `vehicle` (Query string, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Fuel logs retrieved.",
      "data": [
        {
          "id": 201,
          "vehicle": 10,
          "liters": 150.00,
          "cost": 210.00,
          "odometer": 45600.0,
          "logged_at": "2026-07-12T11:00:00Z"
        }
      ]
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `POST /api/fuel`
- **Method**: `POST`
- **Purpose**: Record a refueling transaction.
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`, `Financial Analyst`
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "liters": 150.00,
    "cost": 210.00,
    "odometer": 45600.0
  }
  ```
- **Success Response**:
  - **Status Code**: `201 Created`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Fuel log recorded successfully.",
      "data": {
        "id": 201,
        "vehicle": 10,
        "liters": 150.00,
        "cost": 210.00,
        "odometer": 45600.0
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Invalid odometer sequence or values)
- **Business Rules**:
  - **Odometer Sequence Check**: The new `odometer` reading must be greater than or equal to the current recorded mileage on the vehicle model.
- **Notes**: Automatically updates the vehicle's overall odometer status upon validation.

---

### Endpoint: `PUT /api/fuel/{id}`
- **Method**: `PUT`
- **Purpose**: Modify a fuel record.
- **Authentication Required**: Yes
- **Allowed Roles**: `Financial Analyst`, `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "liters": 140.00,
    "cost": 196.00,
    "odometer": 45600.0
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Fuel log updated successfully.",
      "data": {
        "id": 201,
        "vehicle": 10,
        "liters": 140.00,
        "cost": 196.00,
        "odometer": 45600.0
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Odometer mismatch)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **Odometer Sequence Check**: Updated odometer readings must validate sequence rules.
- **Notes**: None

---

### Endpoint: `DELETE /api/fuel/{id}`
- **Method**: `DELETE`
- **Purpose**: Delete a fuel log entry.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Fuel log deleted.",
      "data": {}
    }
    ```
- **Error Responses**:
  - **Status Code**: `404 Not Found`
- **Business Rules**: None
- **Notes**: None

---

## Module: Expenses

### Endpoint: `GET /api/expenses`
- **Method**: `GET`
- **Purpose**: Get list of all operational expenses.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Financial Analyst`
- **Request Parameters**:
  - `category` (Query string, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Expenses list retrieved.",
      "data": [
        {
          "id": 99,
          "vehicle": 10,
          "category": "Toll",
          "amount": 25.00,
          "description": "Highway toll expense",
          "approved": true
        }
      ]
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `POST /api/expenses`
- **Method**: `POST`
- **Purpose**: Log an operational expense.
- **Authentication Required**: Yes
- **Allowed Roles**: `Dispatcher`, `Financial Analyst`
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "category": "Toll",
    "amount": 2500.00,
    "description": "Toll and fuel emergency costs"
  }
  ```
- **Success Response**:
  - **Status Code**: `201 Created`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Expense log created.",
      "data": {
        "id": 99,
        "vehicle": 10,
        "category": "Toll",
        "amount": 2500.00,
        "description": "Toll and fuel emergency costs",
        "approved": false
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Invalid payload format)
- **Business Rules**:
  - **Financial Control threshold**: Any expense with an `amount` greater than $1,000.00 is flagged as `approved: false` and requires Fleet Manager review. If less than $1,000.00, it is auto-approved.
- **Notes**: None

---

### Endpoint: `PUT /api/expenses/{id}`
- **Method**: `PUT`
- **Purpose**: Update an expense or approve/reject it.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager` (for approvals), `Financial Analyst`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**:
  ```json
  {
    "vehicle": 10,
    "category": "Toll",
    "amount": 2500.00,
    "description": "Toll and fuel emergency costs",
    "approved": true
  }
  ```
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Expense record updated.",
      "data": {
        "id": 99,
        "vehicle": 10,
        "category": "Toll",
        "amount": 2500.00,
        "approved": true
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `403 Forbidden` (Non-Managers attempting to update authorization state)
  - **Status Code**: `404 Not Found`
- **Business Rules**:
  - **Role-Based Approvals**: Only users with the `Fleet Manager` role are allowed to modify the `approved` field.
- **Notes**: None

---

### Endpoint: `DELETE /api/expenses/{id}`
- **Method**: `DELETE`
- **Purpose**: Delete an expense record.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`
- **Request Parameters**:
  - `id` (Path variable, integer, required)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Expense log deleted successfully.",
      "data": {}
    }
    ```
- **Error Responses**:
  - **Status Code**: `404 Not Found`
- **Business Rules**: None
- **Notes**: None

---

## Module: Dashboard

### Endpoint: `GET /api/dashboard`
- **Method**: `GET`
- **Purpose**: Retrieve key performance indicators, aggregation statistics, and lists of recent trips.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Dispatcher`, `Safety Officer`, `Financial Analyst`
- **Request Parameters**: None
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Dashboard statistics retrieved.",
      "data": {
        "available_vehicles": 15,
        "vehicles_on_trip": 4,
        "drivers_available": 18,
        "drivers_on_trip": 4,
        "maintenance_count": 2,
        "total_fuel_cost": 4200.50,
        "total_maintenance_cost": 1500.00,
        "total_expenses": 5700.50,
        "fleet_utilization": 21.0,
        "recent_trips": [
          {
            "id": 42,
            "origin": "Depot A",
            "destination": "Depot B",
            "vehicle_reg": "TX-9988-AB",
            "driver_name": "Jane Smith",
            "status": "Dispatched"
          }
        ]
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `401 Unauthorized`
- **Business Rules**: None
- **Notes**: Values are recalculated dynamically or retrieved from aggregated caching systems.

---

## Module: Reports

### Endpoint: `GET /api/reports/fleet`
- **Method**: `GET`
- **Purpose**: Export detailed metrics of vehicle usage, mileage changes, and total allocations.
- **Authentication Required**: Yes
- **Allowed Roles**: `Fleet Manager`, `Financial Analyst`
- **Request Parameters**:
  - `start_date` (Query string, string, format `YYYY-MM-DD`, optional)
  - `end_date` (Query string, string, format `YYYY-MM-DD`, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Fleet utilization report generated.",
      "data": {
        "total_miles_driven": 14200.0,
        "active_vehicles_ratio": 0.85,
        "utilization_by_vehicle": [
          {
            "vehicle_id": 10,
            "trips_count": 8,
            "distance_km": 1250.0
          }
        ]
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request` (Invalid date range formatting)
- **Business Rules**: None
- **Notes**: Supports exporting options or specific date range groupings.

---

### Endpoint: `GET /api/reports/expenses`
- **Method**: `GET`
- **Purpose**: Retrieve expense categories distributions, totals, and historical changes.
- **Authentication Required**: Yes
- **Allowed Roles**: `Financial Analyst`, `Fleet Manager`
- **Request Parameters**:
  - `start_date` (Query string, string, optional)
  - `end_date` (Query string, string, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Expense report generated.",
      "data": {
        "total_sum": 5700.50,
        "breakdown": {
          "Fuel": 4200.50,
          "Maintenance": 1500.00,
          "Toll": 0.00
        }
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request`
- **Business Rules**: None
- **Notes**: None

---

### Endpoint: `GET /api/reports/fuel`
- **Method**: `GET`
- **Purpose**: Get report summaries of average mileage, liters consumed, and fuel expenses.
- **Authentication Required**: Yes
- **Allowed Roles**: `Financial Analyst`, `Fleet Manager`
- **Request Parameters**:
  - `start_date` (Query string, string, optional)
  - `end_date` (Query string, string, optional)
- **Request Body**: None
- **Success Response**:
  - **Status Code**: `200 OK`
  - **Payload**:
    ```json
    {
      "success": true,
      "message": "Fuel consumption report generated.",
      "data": {
        "total_liters": 2800.0,
        "total_cost": 4200.50,
        "avg_liters_per_100km": 12.5
      }
    }
    ```
- **Error Responses**:
  - **Status Code**: `400 Bad Request`
- **Business Rules**: None
- **Notes**: None

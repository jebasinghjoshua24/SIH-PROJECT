# Street Light Fault Register and Repair Tracker

## Problem
Residents report street light faults to the municipal office, but there is no digital tracking—complaints get lost on paper, and the electrical section cannot prioritize repairs or identify recurring issues.

## Solution
A web-based fault register that records each reported fault with location and date, tracks it through to repair, and shows which faults have been outstanding longest.

## How to Run

### Prerequisites
- Node.js installed
- npm installed

### Steps
1. Clone the repository
2. Navigate to the Server folder: `cd Server`
3. Install dependencies: `npm install express better-sqlite3 cors`
4. Start the server: `node server.js`
5. Open your browser and go to: `http://localhost:2000`

## Database Schema

| Field | Type | Description |
|-------|------|-------------|
| `fault_id` | INTEGER | Unique ID (auto-increment) |
| `pole_id` | TEXT | Pole identifier (e.g., P-101) |
| `ward` | TEXT | Municipal ward (can be null) |
| `street` | TEXT | Street name |
| `reported_date` | TEXT | Date complaint was received |
| `fault_type` | TEXT | Type of fault (Bulb Fuse, Cable Cut, Pole Damaged) |
| `status` | TEXT | Current status (Pending, In Progress, Repaired) |
| `repaired_date` | TEXT | Date repaired (null if not repaired) |

## Derived Figure Calculation

**Days Outstanding** is calculated on the backend:

- If `status` is `Repaired`: `days_outstanding = 0`
- If `status` is `Pending` or `In Progress`:
  - `days_outstanding = (Today's Date - reported_date)` (in days)
  - If `reported_date` is in the future, `days_outstanding = 0`

This figure is calculated on the server and sent to the frontend with every API response.

## API Endpoints

### POST /api/faults
Submit a new fault report. Validates all fields on the server before saving.

### GET /api/faults
List all faults. Supports:
- `?search=` — Search by `pole_id` or `street`
- `?status=` — Filter by status (Pending, In Progress, Repaired)
- Sorting: Pending faults first, then oldest `reported_date`

## Features

- ✅ Register new faults with server-side validation
- ✅ View all faults with search and filtering
- ✅ Pending faults sorted to the top (oldest first)
- ✅ Days outstanding calculated on the server
- ✅ Loading, empty, and error states on all screens
- ✅ Handles awkward data (missing ward, future dates, similar names)

## Screenshots

*(Insert your screenshots here)*

1. Register Page
2. List Page
3. Search Results (e.g., "Main" showing Main + Maine)
4. Error State (e.g., network failure)

## Video Demonstration

*(Link to your 3-minute demo video)*

All tasks completed as per the problem statement.
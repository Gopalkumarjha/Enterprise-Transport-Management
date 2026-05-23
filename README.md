# Enterprise Transport Management

Modern Transport Management Module for manufacturing logistics, fleet tracking, delivery scheduling, shipment management, route optimization, and delivery confirmation.

## Overview

The application is inspired by enterprise logistics platforms such as:
- SAP Transportation Management
- Oracle Transportation Management
- Fleetx
- Delhivery
- Rivigo
- Zoho Logistics

---

## Features

- Role-based workspace for:
  - Admin
  - Transport Manager
  - Driver
  - Customer

- Executive dashboard with:
  - Shipment KPIs
  - Vehicle KPIs
  - Fuel analytics
  - Delay tracking
  - Cost monitoring

- Interactive analytics using Recharts

- Shipment order management with auto-generated shipment IDs

- Shipment status flow:
  - Pending
  - Loaded
  - In Transit
  - Delivered

- Fleet management:
  - Vehicle capacity
  - Fuel type
  - Insurance
  - Maintenance
  - Availability
  - Utilization

- Driver management:
  - License tracking
  - Attendance
  - Assigned trips
  - Performance monitoring

- Delivery scheduling and allocation

- Live vehicle tracking simulation with ETA

- Smart route recommendations

- Delivery confirmation:
  - OTP verification
  - Digital signature
  - Proof image upload

- Notification and delay alert system

- Reports:
  - Shipment history
  - Fuel usage
  - Delivery efficiency
  - Vehicle performance

- Responsive enterprise UI
- Dark & Light mode support

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts
- Lucide React
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Project Structure

```bash
src/
├── main.jsx
├── styles.css

server/
├── index.js
├── seed.js
├── static-preview.js
└── models/
    ├── Driver.js
    ├── Shipment.js
    └── Vehicle.js

index.html
package.json
tailwind.config.js
postcss.config.js

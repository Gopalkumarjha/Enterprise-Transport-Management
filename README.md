# Manufacturing Transport Management Module

Enterprise-style logistics and fleet management module for a manufacturing company.

## Features

- Role-aware shell for Admin, Transport Manager, Driver, and Customer
- Dashboard KPIs, cost analytics, fuel charts, and delivery trend views
- Shipment creation, automatic shipment IDs, status progression, priority, and tracking
- Fleet, driver, delivery scheduling, route optimization, proof of delivery, notifications, and reports
- Live vehicle tracking simulation with route and ETA cards
- Express API skeleton with MongoDB-ready Mongoose models

## Run Locally

```bash
npm install
npm run dev
```

Frontend: `http://127.0.0.1:5173`

Backend health check: `http://127.0.0.1:5000/api/health`

Verified production preview:

```bash
npm run build
npm run preview
```

Preview: `http://127.0.0.1:4173`

Set `MONGODB_URI` in `.env` to persist backend data. Without it, the API still runs and the frontend uses seeded in-memory data.

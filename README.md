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

## Features

- Role-based workspace for Admin, Transport Manager, Driver, and Customer
- Executive dashboard with shipment, vehicle, delivery, fuel, cost, and delay KPIs
- Interactive analytics using Recharts
- Shipment order management with auto-generated shipment IDs
- Shipment flow from Pending to Loaded, In Transit, and Delivered
- Fleet management for capacity, fuel, insurance, maintenance, availability, and utilization
- Driver license, attendance, trip, and performance tracking
- Delivery scheduling and vehicle/driver allocation
- Live vehicle tracking simulation with route visualization and ETA
- Smart route recommendations with fuel, toll, and traffic-aware estimates
- Delivery confirmation with OTP, digital signature, and proof image workflow
- Notification and delay alert panels
- Shipment, fuel usage, delivery efficiency, and vehicle performance reports
- Responsive enterprise UI with dark and light mode
- MongoDB-ready Express API

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
- MongoDB with Mongoose

## Project Structure

```text
src/
|-- api.js
|-- main.jsx
`-- styles.css

server/
|-- index.js
|-- seed.js
|-- static-preview.js
`-- models/
    |-- Driver.js
    |-- Shipment.js
    `-- Vehicle.js

index.html
package.json
render.yaml
vercel.json
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run frontend and backend together:

```bash
npm run dev
```

Frontend: `http://127.0.0.1:5173`

Backend health check: `http://127.0.0.1:5000/api/health`

## Production Preview

```bash
npm run build
npm run preview
```

Preview URL: `http://127.0.0.1:4173`

## Environment Variables

Copy `.env.example` to `.env` for local full-stack development:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/transport_management
CLIENT_URL=http://127.0.0.1:5173,http://127.0.0.1:4173
VITE_API_URL=http://127.0.0.1:5000
```

If `VITE_API_URL` is not set, the frontend remains usable in demo mode. If a configured API cannot be reached, the interface displays `Demo Fallback`.

## Deployment

Recommended hosting setup:

| Component | Provider | Configuration |
| --- | --- | --- |
| Frontend | Vercel | Vite build output in `dist` |
| Backend API | Render | Node web service using `render.yaml` |
| Database | MongoDB Atlas | Managed MongoDB cluster |

### 1. Create MongoDB Atlas Database

1. Create a MongoDB Atlas cluster and database user.
2. Permit the Render service connection in Atlas Network Access.
3. Copy the application connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transport_management
```

### 2. Deploy Backend on Render

1. In Render, choose **New > Blueprint** and connect this GitHub repository.
2. Render detects `render.yaml`.
3. Set these environment variables:

```env
MONGODB_URI=your_atlas_connection_string
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

4. Confirm the deployed health endpoint:

```text
https://your-render-service.onrender.com/api/health
```

### 3. Deploy Frontend on Vercel

1. Import this GitHub repository into Vercel.
2. Vercel reads `vercel.json` and builds the Vite frontend.
3. Add the Render API URL:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

4. Deploy the project.

### 4. Complete Cross-Origin Setup

After Vercel provides the final frontend URL, set Render's `CLIENT_URL` to that exact URL and redeploy the API. Multiple permitted URLs may be comma-separated.

When deployment is connected correctly, the header badge changes from `Demo Data` to `API Live`, and new shipments are stored in MongoDB Atlas.

## API Overview

```text
GET    /api/health
GET    /api/shipments
POST   /api/shipments
PATCH  /api/shipments/:id/status
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
GET    /api/drivers
POST   /api/schedules/check-availability
POST   /api/routes/optimize
POST   /api/deliveries/:shipmentId/confirm
```

## Available Scripts

```bash
npm run dev       # Run frontend and backend
npm run client    # Run Vite frontend
npm run server    # Run Express backend
npm run build     # Build frontend
npm run preview   # Serve compiled frontend
npm run lint      # Run ESLint
```

## License

This project is provided for educational and portfolio use.

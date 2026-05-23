Enterprise Transport Management
Modern Transport Management Module for manufacturing logistics, fleet tracking, delivery scheduling, shipment management, route optimization, and delivery confirmation.

The application is inspired by enterprise logistics platforms such as SAP Transportation Management, Oracle Transportation Management, Fleetx, Delhivery, Rivigo, and Zoho Logistics.

Features
Role-based workspace for Admin, Transport Manager, Driver, and Customer
Executive dashboard with shipment, vehicle, delivery, fuel, cost, and delay KPIs
Interactive analytics using Recharts
Shipment order management with auto-generated shipment IDs
Shipment status flow: Pending, Loaded, In Transit, Delivered
Fleet management with vehicle capacity, fuel type, insurance, maintenance, availability, and utilization
Driver profile, license, attendance, assigned trips, and performance tracking
Delivery scheduling with vehicle and driver allocation
Live vehicle tracking simulation with route visualization and ETA
Smart route recommendation with fuel, toll, and traffic-aware estimates
Delivery confirmation with OTP, digital signature, and proof image workflow
SMS/email style notification and delay alert panels
Reports for shipment history, fuel usage, delivery efficiency, and vehicle performance
Responsive enterprise UI with dark and light mode
Express API skeleton with MongoDB-ready Mongoose models
Tech Stack
Frontend:

React.js
Tailwind CSS
Recharts
Lucide React
Vite
Backend:

Node.js
Express.js
MongoDB with Mongoose
Project Structure
.
├── src/
│   ├── main.jsx
│   └── styles.css
├── server/
│   ├── index.js
│   ├── seed.js
│   ├── static-preview.js
│   └── models/
│       ├── Driver.js
│       ├── Shipment.js
│       └── Vehicle.js
├── index.html
├── package.json
├── tailwind.config.js
└── postcss.config.js
Getting Started
Install dependencies:

npm install
Run frontend and backend together:

npm run dev
Frontend:

http://127.0.0.1:5173
Backend health check:

http://127.0.0.1:5000/api/health
Production Preview
Build the frontend:

npm run build
Serve the compiled app:

npm run preview
Preview URL:

http://127.0.0.1:4173
Environment Variables
Create a .env file if you want MongoDB persistence:

MONGODB_URI=mongodb://127.0.0.1:27017/transport_management
PORT=5000
If MONGODB_URI is not set, the backend still starts, and the frontend uses seeded in-memory demo data.

API Overview
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
Available Scripts
npm run dev       # Run frontend and backend
npm run client    # Run Vite frontend
npm run server    # Run Express backend
npm run build     # Build frontend
npm run preview   # Serve compiled frontend
npm run lint      # Run ESLint
Use Cases
Manufacturing dispatch control tower
Fleet and driver operations dashboard
Shipment visibility portal
Delivery planning and ETA management
Logistics cost and fuel efficiency analysis
Smart route and delay risk simulation
License
This project is provided for educational and portfolio use.

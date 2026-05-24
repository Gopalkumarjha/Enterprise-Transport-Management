import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { Driver } from './models/Driver.js';
import { Shipment } from './models/Shipment.js';
import { Vehicle } from './models/Vehicle.js';
import { seed } from './seed.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_URLS = (process.env.CLIENT_URL || 'http://127.0.0.1:5173,http://127.0.0.1:4173')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || CLIENT_URLS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not permitted by CORS configuration.'));
  }
}));
app.use(express.json({ limit: '10mb' }));

let databaseConnected = false;

async function connectDatabase() {
  if (!MONGODB_URI) return;
  await mongoose.connect(MONGODB_URI);
  databaseConnected = true;
  await seed();
}

app.get('/api/health', (_request, response) => {
  response.json({
    service: 'Manufacturing Transport Management API',
    status: 'ok',
    databaseConnected,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/shipments', async (_request, response, next) => {
  try {
    response.json(await Shipment.find().sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

app.post('/api/shipments', async (request, response, next) => {
  try {
    const count = await Shipment.countDocuments();
    const shipment = await Shipment.create({
      shipmentId: `MFG-SHP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`,
      ...request.body
    });
    response.status(201).json(shipment);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/shipments/:id/status', async (request, response, next) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(
      request.params.id,
      { status: request.body.status },
      { new: true, runValidators: true }
    );
    response.json(shipment);
  } catch (error) {
    next(error);
  }
});

app.get('/api/vehicles', async (_request, response, next) => {
  try {
    response.json(await Vehicle.find().sort({ vehicleNumber: 1 }));
  } catch (error) {
    next(error);
  }
});

app.post('/api/vehicles', async (request, response, next) => {
  try {
    response.status(201).json(await Vehicle.create(request.body));
  } catch (error) {
    next(error);
  }
});

app.put('/api/vehicles/:id', async (request, response, next) => {
  try {
    response.json(await Vehicle.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true }));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/vehicles/:id', async (request, response, next) => {
  try {
    await Vehicle.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get('/api/drivers', async (_request, response, next) => {
  try {
    response.json(await Driver.find().sort({ name: 1 }));
  } catch (error) {
    next(error);
  }
});

app.post('/api/schedules/check-availability', async (request, response, next) => {
  try {
    const { vehicleNumber, dispatchDate } = request.body;
    const conflict = await Shipment.exists({
      vehicleNumber,
      scheduledDate: dispatchDate,
      status: { $in: ['Loaded', 'In Transit'] }
    });
    response.json({ available: !conflict, vehicleNumber, dispatchDate });
  } catch (error) {
    next(error);
  }
});

app.post('/api/routes/optimize', (request, response) => {
  const { origin, destination, capacityTons = 14 } = request.body;
  response.json({
    origin,
    destination,
    recommendedRoute: 'Traffic Aware Industrial Corridor',
    distanceKm: 147,
    etaMinutes: 215,
    fuelEstimateLiters: Math.round(capacityTons * 3.7),
    tollEstimateInr: 2850,
    delayPredictionPercent: 18
  });
});

app.post('/api/deliveries/:shipmentId/confirm', async (request, response, next) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { shipmentId: request.params.shipmentId },
      {
        status: 'Delivered',
        proofOfDelivery: {
          otpVerified: Boolean(request.body.otp),
          signatureUrl: request.body.signatureUrl,
          imageUrl: request.body.imageUrl,
          deliveredAt: new Date()
        }
      },
      { new: true }
    );
    response.json(shipment);
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  response.status(400).json({
    message: error.message || 'Transport API error'
  });
});

connectDatabase()
  .catch((error) => {
    console.warn('MongoDB connection failed:', error.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Transport API listening on http://127.0.0.1:${PORT}`);
    });
  });

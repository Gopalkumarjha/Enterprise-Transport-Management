import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, unique: true, required: true },
    capacity: { type: String, required: true },
    type: { type: String, required: true },
    fuelType: { type: String, enum: ['Diesel', 'CNG', 'Electric', 'Hybrid'], default: 'Diesel' },
    availabilityStatus: { type: String, enum: ['Available', 'Reserved', 'On Trip', 'Maintenance'], default: 'Available' },
    insuranceExpiry: String,
    maintenanceStatus: { type: String, default: 'Healthy' },
    utilizationPercent: { type: Number, default: 0 },
    currentLocation: String,
    iotTelemetry: {
      engineTemperature: Number,
      fuelLevelPercent: Number,
      tyrePressureStatus: String
    }
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);

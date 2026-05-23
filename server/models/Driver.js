import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    licenseNumber: { type: String, unique: true, required: true },
    licenseExpiry: String,
    assignedTrips: { type: Number, default: 0 },
    attendanceStatus: { type: String, enum: ['Present', 'Absent', 'On Route'], default: 'Present' },
    onTimeDeliveryPercent: { type: Number, default: 0 },
    performanceRating: { type: Number, default: 0 },
    history: [
      {
        shipmentId: String,
        route: String,
        completedAt: Date
      }
    ]
  },
  { timestamps: true }
);

export const Driver = mongoose.model('Driver', driverSchema);

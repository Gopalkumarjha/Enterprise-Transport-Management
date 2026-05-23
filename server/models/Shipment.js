import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: { type: String, unique: true, index: true },
    customer: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'Loaded', 'In Transit', 'Delivered'], default: 'Pending' },
    vehicleNumber: String,
    driverName: String,
    scheduledDate: String,
    eta: String,
    costInr: { type: Number, default: 0 },
    delayPredictionPercent: { type: Number, default: 0 },
    proofOfDelivery: {
      otpVerified: Boolean,
      signatureUrl: String,
      imageUrl: String,
      deliveredAt: Date
    }
  },
  { timestamps: true }
);

export const Shipment = mongoose.model('Shipment', shipmentSchema);

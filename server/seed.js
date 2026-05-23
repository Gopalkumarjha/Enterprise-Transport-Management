import { Driver } from './models/Driver.js';
import { Shipment } from './models/Shipment.js';
import { Vehicle } from './models/Vehicle.js';

export async function seed() {
  const [shipments, vehicles, drivers] = await Promise.all([
    Shipment.countDocuments(),
    Vehicle.countDocuments(),
    Driver.countDocuments()
  ]);

  if (shipments || vehicles || drivers) return;

  await Vehicle.insertMany([
    {
      vehicleNumber: 'MH12 KT 4481',
      capacity: '18 Ton',
      type: '32ft Multi Axle',
      fuelType: 'Diesel',
      availabilityStatus: 'On Trip',
      insuranceExpiry: '2026-11-18',
      maintenanceStatus: 'Healthy',
      utilizationPercent: 86,
      currentLocation: 'Near Talegaon MIDC'
    },
    {
      vehicleNumber: 'GJ01 LV 2140',
      capacity: '26 Ton',
      type: 'Container Trailer',
      fuelType: 'Diesel',
      availabilityStatus: 'Reserved',
      insuranceExpiry: '2026-08-02',
      maintenanceStatus: 'Service Due',
      utilizationPercent: 71,
      currentLocation: 'Nashik Loading Bay'
    }
  ]);

  await Driver.insertMany([
    {
      name: 'Rohan Patil',
      phone: '+91 98765 44012',
      licenseNumber: 'MH-2028-77821',
      licenseExpiry: '2028-07-31',
      assignedTrips: 26,
      attendanceStatus: 'On Route',
      onTimeDeliveryPercent: 94,
      performanceRating: 4.8
    },
    {
      name: 'Farhan Shaikh',
      phone: '+91 98222 11090',
      licenseNumber: 'GJ-2027-11890',
      licenseExpiry: '2027-05-11',
      assignedTrips: 21,
      attendanceStatus: 'Present',
      onTimeDeliveryPercent: 89,
      performanceRating: 4.6
    }
  ]);

  await Shipment.insertMany([
    {
      shipmentId: 'MFG-SHP-2026-00001',
      customer: 'Apex Auto Components',
      source: 'Pune Plant A',
      destination: 'Chakan Assembly Unit',
      priority: 'High',
      status: 'In Transit',
      vehicleNumber: 'MH12 KT 4481',
      driverName: 'Rohan Patil',
      scheduledDate: '2026-05-23',
      eta: '15:40',
      costInr: 48500,
      delayPredictionPercent: 18
    }
  ]);
}

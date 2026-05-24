const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiConfigured = Boolean(API_URL);

export function normalizeShipment(shipment) {
  return {
    _id: shipment._id,
    id: shipment.shipmentId || shipment.id,
    customer: shipment.customer,
    origin: shipment.source || shipment.origin,
    destination: shipment.destination,
    priority: shipment.priority,
    status: shipment.status,
    vehicle: shipment.vehicleNumber || shipment.vehicle || 'Unassigned',
    driver: shipment.driverName || shipment.driver || 'Awaiting allocation',
    eta: shipment.eta || 'Auto ETA pending',
    cost: shipment.costInr ?? shipment.cost ?? 0,
    delayRisk: shipment.delayPredictionPercent ?? shipment.delayRisk ?? 0
  };
}

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export async function getShipments() {
  return (await request('/api/shipments')).map(normalizeShipment);
}

export async function createShipment(order) {
  return normalizeShipment(await request('/api/shipments', {
    method: 'POST',
    body: JSON.stringify(order)
  }));
}

export async function updateShipmentStatus(id, status) {
  return normalizeShipment(await request(`/api/shipments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }));
}

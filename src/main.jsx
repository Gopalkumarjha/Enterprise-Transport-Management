import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileSpreadsheet,
  Fuel,
  Gauge,
  LayoutDashboard,
  LocateFixed,
  Moon,
  PackageCheck,
  Plus,
  Route,
  Satellite,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  UserRoundCheck,
  Users,
  Warehouse
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { apiConfigured, createShipment, getShipments, updateShipmentStatus } from './api.js';
import './styles.css';

const roles = ['Admin', 'Transport Manager', 'Driver', 'Customer'];

const shipmentsSeed = [
  {
    id: 'MFG-SHP-2026-0518',
    customer: 'Apex Auto Components',
    origin: 'Pune Plant A',
    destination: 'Chakan Assembly Unit',
    priority: 'High',
    status: 'In Transit',
    vehicle: 'MH12 KT 4481',
    driver: 'Rohan Patil',
    eta: '15:40',
    cost: 48500,
    delayRisk: 18
  },
  {
    id: 'MFG-SHP-2026-0519',
    customer: 'Nordex Wind Systems',
    origin: 'Nashik Forge',
    destination: 'Mundra Export Yard',
    priority: 'Critical',
    status: 'Loaded',
    vehicle: 'GJ01 LV 2140',
    driver: 'Farhan Shaikh',
    eta: 'Tomorrow 08:20',
    cost: 126000,
    delayRisk: 32
  },
  {
    id: 'MFG-SHP-2026-0520',
    customer: 'Zenith Appliances',
    origin: 'Bhiwandi DC',
    destination: 'Hyderabad Warehouse',
    priority: 'Medium',
    status: 'Pending',
    vehicle: 'KA05 MT 7782',
    driver: 'Meera Singh',
    eta: 'Scheduled',
    cost: 79500,
    delayRisk: 11
  },
  {
    id: 'MFG-SHP-2026-0521',
    customer: 'Metro Rail Fabrication',
    origin: 'Nagpur Steel Yard',
    destination: 'Bengaluru Metro Depot',
    priority: 'High',
    status: 'Delivered',
    vehicle: 'MH31 AQ 9042',
    driver: 'Suresh Nair',
    eta: 'Delivered 11:10',
    cost: 98500,
    delayRisk: 6
  }
];

const vehiclesSeed = [
  {
    number: 'MH12 KT 4481',
    type: '32ft Multi Axle',
    capacity: '18 Ton',
    fuel: 'Diesel',
    available: 'On Trip',
    insurance: '2026-11-18',
    maintenance: 'Healthy',
    utilization: 86,
    location: 'Near Talegaon MIDC'
  },
  {
    number: 'GJ01 LV 2140',
    type: 'Container Trailer',
    capacity: '26 Ton',
    fuel: 'Diesel',
    available: 'Reserved',
    insurance: '2026-08-02',
    maintenance: 'Service Due',
    utilization: 71,
    location: 'Nashik Loading Bay'
  },
  {
    number: 'KA05 MT 7782',
    type: 'Refrigerated Truck',
    capacity: '12 Ton',
    fuel: 'CNG',
    available: 'Available',
    insurance: '2027-01-20',
    maintenance: 'Healthy',
    utilization: 58,
    location: 'Bhiwandi DC'
  },
  {
    number: 'MH31 AQ 9042',
    type: 'Flatbed',
    capacity: '22 Ton',
    fuel: 'Diesel',
    available: 'Available',
    insurance: '2026-07-15',
    maintenance: 'Healthy',
    utilization: 79,
    location: 'Bengaluru Metro Depot'
  }
];

const driversSeed = [
  {
    name: 'Rohan Patil',
    license: 'MH-2028-77821',
    phone: '+91 98765 44012',
    trips: 26,
    attendance: 'Present',
    rating: 4.8,
    onTime: 94
  },
  {
    name: 'Farhan Shaikh',
    license: 'GJ-2027-11890',
    phone: '+91 98222 11090',
    trips: 21,
    attendance: 'On Route',
    rating: 4.6,
    onTime: 89
  },
  {
    name: 'Meera Singh',
    license: 'KA-2029-56102',
    phone: '+91 99887 66123',
    trips: 18,
    attendance: 'Present',
    rating: 4.9,
    onTime: 97
  }
];

const costTrend = [
  { month: 'Jan', cost: 10.8, fuel: 4.1, shipments: 86 },
  { month: 'Feb', cost: 11.2, fuel: 4.4, shipments: 94 },
  { month: 'Mar', cost: 12.9, fuel: 5.1, shipments: 112 },
  { month: 'Apr', cost: 12.1, fuel: 4.8, shipments: 104 },
  { month: 'May', cost: 13.7, fuel: 5.3, shipments: 121 },
  { month: 'Jun', cost: 14.4, fuel: 5.6, shipments: 129 }
];

const routeOptions = [
  { name: 'Fastest NH48 Corridor', km: 147, eta: '3h 35m', fuel: '54 L', toll: '₹2,850', traffic: 'Moderate' },
  { name: 'Fuel Saver Industrial Ring', km: 159, eta: '4h 05m', fuel: '49 L', toll: '₹1,980', traffic: 'Low' },
  { name: 'Traffic Aware Bypass', km: 166, eta: '3h 55m', fuel: '57 L', toll: '₹2,420', traffic: 'Low' }
];

const calendar = [
  { date: '23', title: 'Pune → Chakan', driver: 'Rohan', status: 'In Transit' },
  { date: '24', title: 'Nashik → Mundra', driver: 'Farhan', status: 'Loaded' },
  { date: '25', title: 'Bhiwandi → Hyderabad', driver: 'Meera', status: 'Scheduled' },
  { date: '26', title: 'Nagpur → Bengaluru', driver: 'Suresh', status: 'Dock Slot' }
];

const statusFlow = ['Pending', 'Loaded', 'In Transit', 'Delivered'];
const nav = [
  ['Dashboard', LayoutDashboard],
  ['Shipments', PackageCheck],
  ['Fleet', Truck],
  ['Drivers', Users],
  ['Scheduling', CalendarDays],
  ['Live Tracking', LocateFixed],
  ['Route AI', Route],
  ['Proof & Alerts', ClipboardCheck],
  ['Reports', FileSpreadsheet]
];

function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

function App() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState('Dashboard');
  const [role, setRole] = useState('Transport Manager');
  const [shipments, setShipments] = useState(shipmentsSeed);
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [apiState, setApiState] = useState(apiConfigured ? 'loading' : 'demo');

  useEffect(() => {
    if (!apiConfigured) return;

    getShipments()
      .then((orders) => {
        setShipments(orders);
        setApiState('connected');
      })
      .catch(() => setApiState('unavailable'));
  }, []);

  const metrics = useMemo(() => {
    const transit = shipments.filter((shipment) => shipment.status === 'In Transit').length;
    const delayed = shipments.filter((shipment) => shipment.delayRisk > 25).length;
    return {
      total: shipments.length,
      activeVehicles: vehiclesSeed.filter((vehicle) => vehicle.available !== 'Available').length,
      transit,
      delayed,
      fuel: '5.6k L',
      monthlyCost: '₹14.4L'
    };
  }, [shipments]);

  const addShipment = async () => {
    const next = shipments.length + 522;
    const localShipment = {
      id: `MFG-SHP-2026-${String(next).padStart(4, '0')}`,
      customer: 'New Manufacturing Order',
      origin: 'Plant Dispatch Gate',
      destination: 'Customer DC',
      priority: 'Medium',
      status: 'Pending',
      vehicle: 'Unassigned',
      driver: 'Awaiting allocation',
      eta: 'Auto ETA pending',
      cost: 0,
      delayRisk: 14
    };

    if (apiState === 'connected') {
      try {
        const savedShipment = await createShipment({
          customer: localShipment.customer,
          source: localShipment.origin,
          destination: localShipment.destination,
          priority: localShipment.priority,
          status: localShipment.status,
          eta: localShipment.eta,
          costInr: localShipment.cost,
          delayPredictionPercent: localShipment.delayRisk
        });
        setShipments((current) => [savedShipment, ...current]);
      } catch {
        setApiState('unavailable');
        setShipments((current) => [localShipment, ...current]);
      }
    } else {
      setShipments((current) => [localShipment, ...current]);
    }
    setActive('Shipments');
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-950 transition dark:bg-slate-950 dark:text-slate-100">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white/95 p-5 backdrop-blur xl:block dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white dark:bg-mint">
              <Warehouse size={25} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Manufacturing</p>
              <h1 className="text-lg font-bold">Transport OS</h1>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            {nav.map(([item, Icon]) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={classNames(
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition',
                  active === item
                    ? 'bg-slate-950 text-white shadow-panel dark:bg-mint dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <Icon size={18} />
                {item}
              </button>
            ))}
          </div>
          <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase text-slate-500">IoT Signal</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm">96 sensors connected</span>
              <Satellite className="text-mint" size={20} />
            </div>
          </div>
        </aside>

        <main className="xl:pl-72">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-signal dark:text-mint">Enterprise logistics command center</p>
                <h2 className="text-2xl font-bold sm:text-3xl">{active}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    className="h-10 w-64 rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-signal dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Search shipment, vehicle, driver"
                  />
                </div>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
                >
                  {roles.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <button
                  className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  onClick={() => setDark((value) => !value)}
                  aria-label="Toggle dark mode"
                >
                  {dark ? <Sun size={19} /> : <Moon size={19} />}
                </button>
                <ConnectionBadge state={apiState} />
                <button onClick={addShipment} className="btn-primary">
                  <Plus size={18} /> New Shipment
                </button>
              </div>
            </div>
          </header>

          <section className="p-4 sm:p-6">
            <RoleBanner role={role} />
            {active === 'Dashboard' && <Dashboard metrics={metrics} shipments={shipments} />}
            {active === 'Shipments' && <Shipments shipments={shipments} setShipments={setShipments} apiState={apiState} setApiState={setApiState} />}
            {active === 'Fleet' && <Fleet openForm={() => setVehicleFormOpen(true)} />}
            {active === 'Drivers' && <Drivers />}
            {active === 'Scheduling' && <Scheduling />}
            {active === 'Live Tracking' && <LiveTracking />}
            {active === 'Route AI' && <RouteAI />}
            {active === 'Proof & Alerts' && <ProofAlerts />}
            {active === 'Reports' && <Reports />}
          </section>
        </main>

        {vehicleFormOpen && <VehicleModal close={() => setVehicleFormOpen(false)} />}
      </div>
    </div>
  );
}

function RoleBanner({ role }) {
  const copy = {
    Admin: 'Full control over master data, approvals, billing, integrations, and audit trails.',
    'Transport Manager': 'Plan dispatches, assign resources, track vehicles, manage exceptions, and optimize cost.',
    Driver: 'Focused trip manifest, attendance, route, ETA, and delivery confirmation access.',
    Customer: 'Shipment visibility, ETA updates, delivery proofs, and notification preferences.'
  };
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 text-signal dark:text-mint" />
        <div>
          <p className="text-sm font-bold">{role} Workspace</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{copy[role]}</p>
        </div>
      </div>
      <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-mint">RBAC active</span>
    </div>
  );
}

function Dashboard({ metrics, shipments }) {
  const cards = [
    ['Total Shipments', metrics.total, PackageCheck, '12.4% vs last month'],
    ['Active Vehicles', metrics.activeVehicles, Truck, 'Fleet utilization 73%'],
    ['Deliveries In Transit', metrics.transit, Route, '5 live route pings'],
    ['Delayed Deliveries', metrics.delayed, AlertTriangle, 'AI risk threshold'],
    ['Fuel Overview', metrics.fuel, Fuel, 'Diesel + CNG mixed fleet'],
    ['Monthly Logistics Cost', metrics.monthlyCost, Gauge, '₹1.2L saved by route AI']
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, Icon, note]) => (
          <div key={label} className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <h3 className="mt-2 text-3xl font-bold">{value}</h3>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-signal dark:bg-slate-800 dark:text-mint">
                <Icon size={21} />
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold text-emerald-600">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="panel p-5">
          <PanelTitle icon={Activity} title="Monthly Logistics Cost & Fuel" action="Live analytics" />
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrend}>
                <defs>
                  <linearGradient id="cost" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cost" name="Cost ₹L" stroke="#2563eb" fill="url(#cost)" strokeWidth={3} />
                <Line type="monotone" dataKey="fuel" name="Fuel kL" stroke="#12b981" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <PanelTitle icon={Sparkles} title="AI Delay Prediction" action="Smart alerts" />
          <div className="mt-5 space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold">{shipment.id}</p>
                    <p className="text-xs text-slate-500">{shipment.origin} to {shipment.destination}</p>
                  </div>
                  <span className={classNames('text-sm font-bold', shipment.delayRisk > 25 ? 'text-amberline' : 'text-emerald-600')}>
                    {shipment.delayRisk}%
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-signal dark:bg-mint" style={{ width: `${shipment.delayRisk}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Shipments({ shipments, setShipments, apiState, setApiState }) {
  const advance = async (shipment) => {
    const next = statusFlow[Math.min(statusFlow.indexOf(shipment.status) + 1, statusFlow.length - 1)];

    if (apiState === 'connected' && shipment._id) {
      try {
        const updatedShipment = await updateShipmentStatus(shipment._id, next);
        setShipments((current) => current.map((item) => (item.id === shipment.id ? updatedShipment : item)));
        return;
      } catch {
        setApiState('unavailable');
      }
    }

    setShipments((current) => current.map((item) => (item.id === shipment.id ? { ...item, status: next } : item)));
  };
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800 md:flex-row md:items-center">
        <PanelTitle icon={PackageCheck} title="Shipment Order Management" action="Auto IDs enabled" />
        <button className="btn-secondary">
          <Download size={17} /> Export manifest
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900">
            <tr>
              {['Shipment', 'Lane', 'Priority', 'Status', 'Vehicle', 'Driver', 'ETA', 'Action'].map((head) => (
                <th key={head} className="px-5 py-4">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                <td className="px-5 py-4">
                  <p className="font-bold">{shipment.id}</p>
                  <p className="text-xs text-slate-500">{shipment.customer}</p>
                </td>
                <td className="px-5 py-4">{shipment.origin}<ChevronRight className="inline text-slate-400" size={16} />{shipment.destination}</td>
                <td className="px-5 py-4"><Pill value={shipment.priority} /></td>
                <td className="px-5 py-4"><StatusStepper status={shipment.status} /></td>
                <td className="px-5 py-4">{shipment.vehicle}</td>
                <td className="px-5 py-4">{shipment.driver}</td>
                <td className="px-5 py-4">{shipment.eta}</td>
                <td className="px-5 py-4">
                  <button onClick={() => advance(shipment)} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white dark:bg-mint dark:text-slate-950">
                    Move status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Fleet({ openForm }) {
  return (
    <div className="space-y-5">
      <div className="flex justify-between gap-3">
        <PanelTitle icon={Truck} title="Fleet Management" action="Vehicle availability auto-check" />
        <button onClick={openForm} className="btn-primary"><Plus size={18} /> Add Vehicle</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {vehiclesSeed.map((vehicle) => (
          <div key={vehicle.number} className="panel p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-xl font-bold">{vehicle.number}</h3>
                <p className="text-sm text-slate-500">{vehicle.type} • {vehicle.capacity} • {vehicle.fuel}</p>
              </div>
              <Pill value={vehicle.available} />
            </div>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <Info label="Insurance" value={vehicle.insurance} />
              <Info label="Maintenance" value={vehicle.maintenance} />
              <Info label="Location" value={vehicle.location} />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>Utilization</span>
                <b>{vehicle.utilization}%</b>
              </div>
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-3 rounded-full bg-signal dark:bg-mint" style={{ width: `${vehicle.utilization}%` }} />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="btn-secondary">Edit</button>
              <button className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Drivers() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="panel p-5">
        <PanelTitle icon={UserRoundCheck} title="Driver Performance" action="Attendance live" />
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driversSeed}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="onTime" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid gap-4">
        {driversSeed.map((driver) => (
          <div key={driver.name} className="panel p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-bold">{driver.name}</h3>
                <p className="text-sm text-slate-500">License {driver.license} • {driver.phone}</p>
              </div>
              <Pill value={driver.attendance} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Info label="Assigned trips" value={driver.trips} />
              <Info label="Driver rating" value={`${driver.rating}/5`} />
              <Info label="On-time delivery" value={`${driver.onTime}%`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Scheduling() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="panel p-5">
        <PanelTitle icon={CalendarDays} title="Delivery Calendar" action="May 2026" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {calendar.map((item) => (
            <div key={item.date} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-slate-950 text-lg font-bold text-white dark:bg-mint dark:text-slate-950">{item.date}</div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-slate-500">Driver: {item.driver}</p>
                  <Pill value={item.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel p-5">
        <PanelTitle icon={Clock3} title="Schedule Builder" action="Availability checked" />
        <div className="mt-5 space-y-4">
          {['Source plant', 'Destination', 'Vehicle', 'Driver', 'Dispatch date'].map((label, index) => (
            <label key={label} className="block">
              <span className="text-sm font-semibold">{label}</span>
              <input className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder={index === 2 ? 'Only available vehicles shown' : label} />
            </label>
          ))}
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-mint">
            ETA calculation: 5h 20m using distance, driver shift, vehicle capacity, and route traffic.
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveTracking() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
      <div className="panel overflow-hidden">
        <div className="p-5">
          <PanelTitle icon={LocateFixed} title="Live Vehicle Tracking" action="GPS simulation" />
        </div>
        <div className="relative h-[520px] overflow-hidden bg-slate-200 dark:bg-slate-900">
          <div className="absolute inset-0 map-grid opacity-80" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 520">
            <path d="M80 390 C180 310 210 245 330 260 C465 275 495 160 620 145 C720 130 770 200 830 120" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" strokeDasharray="14 12" />
            <circle cx="80" cy="390" r="13" fill="#12b981" />
            <circle cx="830" cy="120" r="13" fill="#f59e0b" />
            <g className="truck-pulse">
              <circle cx="480" cy="210" r="26" fill="#2563eb" opacity="0.18" />
              <rect x="458" y="193" width="44" height="28" rx="8" fill="#111827" />
              <circle cx="468" cy="224" r="5" fill="#12b981" />
              <circle cx="491" cy="224" r="5" fill="#12b981" />
            </g>
          </svg>
          <div className="absolute left-5 top-5 rounded-lg bg-white/95 p-4 shadow-panel dark:bg-slate-950/95">
            <p className="text-sm font-bold">MH12 KT 4481</p>
            <p className="text-xs text-slate-500">Current: Near Talegaon MIDC</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {vehiclesSeed.slice(0, 3).map((vehicle, index) => (
          <div key={vehicle.number} className="panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{vehicle.number}</h3>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Live</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{vehicle.location}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Info label="ETA" value={index === 0 ? '42 min' : '2h 15m'} />
              <Info label="Speed" value={index === 0 ? '58 km/h' : '46 km/h'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteAI() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="panel p-5">
        <PanelTitle icon={Sparkles} title="Smart Route Recommendation" action="AI assisted" />
        <div className="mt-5 space-y-4">
          <Info label="Selected lane" value="Pune Plant A to Chakan Assembly Unit" />
          <Info label="Load profile" value="14.5 Ton automotive assemblies" />
          <Info label="Traffic intelligence" value="Moderate congestion near Talegaon" />
          <Info label="IoT inputs" value="Tyre pressure, engine temp, fuel level normal" />
          <button className="btn-primary w-full justify-center">Generate Recommendation</button>
        </div>
      </div>
      <div className="grid gap-4">
        {routeOptions.map((route, index) => (
          <div key={route.name} className={classNames('panel p-5', index === 0 && 'ring-2 ring-signal dark:ring-mint')}>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-bold">{route.name}</h3>
                <p className="text-sm text-slate-500">{route.km} km • ETA {route.eta} • Traffic {route.traffic}</p>
              </div>
              {index === 0 && <Pill value="Recommended" />}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Info label="Fuel estimation" value={route.fuel} />
              <Info label="Toll estimation" value={route.toll} />
              <Info label="Saving score" value={`${92 - index * 8}/100`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProofAlerts() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="panel p-5">
        <PanelTitle icon={ClipboardCheck} title="Delivery Confirmation" action="POD workflow" />
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">OTP verification</span>
            <input className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-3 tracking-[0.4em] dark:border-slate-700 dark:bg-slate-900" placeholder="6 digit OTP" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <UploadBox label="Digital signature upload" />
            <UploadBox label="Delivery proof image" />
          </div>
          <button className="btn-primary"><CheckCircle2 size={18} /> Confirm Delivery</button>
        </div>
      </div>
      <div className="panel p-5">
        <PanelTitle icon={Bell} title="Notifications" action="SMS + Email" />
        <div className="mt-5 space-y-3">
          {[
            ['Shipment MFG-SHP-2026-0518 crossed Talegaon checkpoint.', 'SMS sent to customer and manager.'],
            ['Potential delay on Nashik to Mundra due to dock congestion.', 'Email escalation created.'],
            ['Vehicle GJ01 LV 2140 has service due after current trip.', 'Maintenance alert assigned.']
          ].map(([title, note]) => (
            <div key={title} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Reports() {
  const pieData = [
    { name: 'On time', value: 78, color: '#12b981' },
    { name: 'Delayed', value: 14, color: '#f59e0b' },
    { name: 'Exception', value: 8, color: '#ef4444' }
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="panel p-5">
        <PanelTitle icon={FileSpreadsheet} title="Exportable Reports" action="PDF / Excel" />
        <div className="mt-5 space-y-3">
          {['Shipment history', 'Fuel usage report', 'Delivery efficiency report', 'Vehicle performance report'].map((report) => (
            <button key={report} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-4 text-left font-semibold dark:border-slate-800">
              {report}
              <Download size={18} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="panel p-5">
          <PanelTitle icon={Gauge} title="Delivery Efficiency" action="Current quarter" />
          <div className="mt-5 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={105} dataKey="value">
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <PanelTitle icon={Fuel} title="Fuel Usage" action="kL" />
          <div className="mt-5 h-72">
            <ResponsiveContainer>
              <LineChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="fuel" stroke="#12b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleModal({ close }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-panel dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Add Vehicle</h3>
          <button onClick={close} className="text-slate-500">Close</button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {['Vehicle number', 'Capacity', 'Type', 'Fuel type', 'Availability status', 'Insurance expiry', 'Maintenance status', 'Utilization %'].map((label) => (
            <label key={label} className="block">
              <span className="text-sm font-semibold">{label}</span>
              <input className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950" />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={close} className="btn-secondary">Cancel</button>
          <button onClick={close} className="btn-primary">Save Vehicle</button>
        </div>
      </div>
    </div>
  );
}

function ConnectionBadge({ state }) {
  const details = {
    connected: ['API Live', 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-mint'],
    loading: ['Connecting', 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'],
    unavailable: ['Demo Fallback', 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'],
    demo: ['Demo Data', 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300']
  };
  const [label, tone] = details[state];
  return <span className={classNames('hidden rounded-full px-3 py-2 text-xs font-bold sm:inline-flex', tone)}>{label}</span>;
}

function PanelTitle({ icon: Icon, title, action }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-signal dark:bg-slate-800 dark:text-mint">
          <Icon size={19} />
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{action}</span>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function Pill({ value }) {
  const tone =
    value === 'Critical' || value === 'Service Due'
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
      : value === 'High' || value === 'Reserved' || value === 'Loaded'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
        : value === 'Available' || value === 'Delivered' || value === 'Recommended'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-mint'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  return <span className={classNames('inline-flex rounded-full px-3 py-1 text-xs font-bold', tone)}>{value}</span>;
}

function StatusStepper({ status }) {
  return (
    <div className="flex min-w-64 items-center gap-1">
      {statusFlow.map((item, index) => {
        const active = statusFlow.indexOf(status) >= index;
        return (
          <div key={item} className="flex flex-1 items-center">
            <div className={classNames('h-2 flex-1 rounded-full', active ? 'bg-signal dark:bg-mint' : 'bg-slate-200 dark:bg-slate-700')} />
          </div>
        );
      })}
      <span className="ml-2 whitespace-nowrap text-xs font-bold">{status}</span>
    </div>
  );
}

function UploadBox({ label }) {
  return (
    <div className="grid h-32 place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800/60">
      {label}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

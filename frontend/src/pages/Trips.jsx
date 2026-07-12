import React, { useState, useEffect } from 'react';
import { tripService } from '../services/tripService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Plus, Check, Ban, X, AlertCircle } from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    source: '',
    destination: '',
    vehicle: '',
    driver: '',
    cargo_weight: '',
    planned_distance: '',
    revenue: '0',
    status: 'DRAFT'
  });
  const [formErrors, setFormErrors] = useState({});

  // Complete Trip dialog states
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [completeForm, setCompleteForm] = useState({
    actual_distance: '',
    fuel_consumed: ''
  });
  const [completeErrors, setCompleteErrors] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripService.getAll(),
        vehicleService.getAll(),
        driverService.getAll()
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (err) {
      console.error('Failed to load trips ledger:', err);
      setError('Could not retrieve operational trips ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setForm({
      source: '',
      destination: '',
      vehicle: '',
      driver: '',
      cargo_weight: '',
      planned_distance: '',
      revenue: '0',
      status: 'DRAFT'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.source.trim()) errors.source = 'Origin location is required';
    if (!form.destination.trim()) errors.destination = 'Destination location is required';
    if (!form.vehicle) errors.vehicle = 'Assigning a vehicle is required';
    if (!form.driver) errors.driver = 'Assigning a driver is required';
    if (!form.cargo_weight || parseFloat(form.cargo_weight) <= 0) {
      errors.cargo_weight = 'Cargo weight must be greater than 0';
    }
    if (!form.planned_distance || parseFloat(form.planned_distance) <= 0) {
      errors.planned_distance = 'Planned distance must be greater than 0';
    }
    if (parseFloat(form.revenue) < 0) {
      errors.revenue = 'Revenue cannot be negative';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...form,
      vehicle: parseInt(form.vehicle),
      driver: parseInt(form.driver),
      cargo_weight: parseFloat(form.cargo_weight),
      planned_distance: parseFloat(form.planned_distance),
      revenue: parseFloat(form.revenue)
    };

    try {
      await tripService.create(payload);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to dispatch trip:', err);
      setError('Operation failed. Check if vehicle or driver are already occupied.');
    }
  };

  const handleDispatch = async (id) => {
    try {
      const trip = trips.find(t => t.id === id);
      await tripService.update(id, { ...trip, status: 'DISPATCHED' });
      fetchData();
    } catch (err) {
      console.error('Failed to dispatch trip:', err);
      setError('Failed to dispatch trip.');
    }
  };

  const openCompleteModal = (id, plannedDist) => {
    setCompletingId(id);
    setCompleteForm({
      actual_distance: plannedDist,
      fuel_consumed: ''
    });
    setCompleteErrors({});
    setIsCompleteOpen(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!completeForm.actual_distance || parseFloat(completeForm.actual_distance) <= 0) {
      errors.actual_distance = 'Actual distance must be greater than 0';
    }
    if (!completeForm.fuel_consumed || parseFloat(completeForm.fuel_consumed) <= 0) {
      errors.fuel_consumed = 'Fuel consumed must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      setCompleteErrors(errors);
      return;
    }

    try {
      await tripService.complete(
        completingId,
        parseFloat(completeForm.actual_distance),
        parseFloat(completeForm.fuel_consumed)
      );
      setIsCompleteOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to complete trip:', err);
      setError('Could not mark trip as completed.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await tripService.cancel(id);
      fetchData();
    } catch (err) {
      console.error('Failed to cancel trip:', err);
      setError('Could not cancel trip.');
    }
  };

  // Helper mappings
  const getVehicleReg = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    return vehicle ? vehicle.registration_number : `ID: #${id}`;
  };

  const getDriverName = (id) => {
    const driver = drivers.find(d => d.id === id);
    return driver ? driver.name : `ID: #${id}`;
  };

  // Search filter
  const filteredTrips = trips.filter(t =>
    t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVehicleReg(t.vehicle).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDriverName(t.driver).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 font-medium">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">Dismiss</button>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-slate-800 text-base font-semibold">Trips Dispatch Ledger</h3>
          <p className="text-xs text-slate-500 mt-1">Route planning, dispatch actions, and mileage tracking logs.</p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          <Plus className="h-4 w-4" />
          <span>Dispatch New Trip</span>
        </Button>
      </div>

      {/* Trips list table */}
      <Table
        headers={['Route', 'Vehicle No.', 'Driver', 'Cargo Load', 'Est. Dist', 'Act. Dist', 'Fuel Cons.', 'Revenue', 'Status', 'Actions']}
        data={filteredTrips}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No trips registered in the operational ledger."
        renderRow={(t) => {
          const statusColors = {
            'DRAFT': 'bg-slate-100 text-slate-700 border-slate-200',
            'DISPATCHED': 'bg-blue-50 text-blue-700 border-blue-200',
            'COMPLETED': 'bg-green-50 text-green-700 border-green-200',
            'CANCELLED': 'bg-red-50 text-red-700 border-red-200'
          };
          return (
            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-3.5 align-middle">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">{t.source}</span>
                  <span className="text-xxs text-slate-400 mt-0.5">→ {t.destination}</span>
                </div>
              </td>
              <td className="px-6 py-3.5 align-middle text-slate-650 text-xs font-semibold">{getVehicleReg(t.vehicle)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-650 text-xs font-semibold">{getDriverName(t.driver)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-semibold">{t.cargo_weight} tons</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-semibold">{t.planned_distance} km</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 text-xs font-bold">{t.actual_distance ? `${t.actual_distance} km` : '-'}</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 text-xs font-bold">{t.fuel_consumed ? `${t.fuel_consumed} L` : '-'}</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 text-xs font-bold">{formatCurrency(t.revenue)}</td>
              <td className="px-6 py-3.5 align-middle">
                <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold border ${statusColors[t.status] || 'bg-slate-100'}`}>
                  {t.status}
                </span>
              </td>
              <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-1.5">
                  {t.status === 'DRAFT' && (
                    <Button variant="outline" size="sm" onClick={() => handleDispatch(t.id)} className="text-blue-600 hover:bg-blue-50 border-blue-200">
                      Dispatch
                    </Button>
                  )}
                  {t.status === 'DISPATCHED' && (
                    <Button variant="primary" size="sm" onClick={() => openCompleteModal(t.id, t.planned_distance)} className="bg-green-600 hover:bg-green-700 text-white">
                      <Check className="h-3.5 w-3.5" />
                      <span>Complete</span>
                    </Button>
                  )}
                  {(t.status === 'DRAFT' || t.status === 'DISPATCHED') && (
                    <Button variant="outline" size="sm" onClick={() => handleCancel(t.id)} className="text-red-500 hover:bg-red-50 border-red-200">
                      <Ban className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          );
        }}
      />

      {/* Dispatch Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-sm leading-6">
                Route Dispatch Form
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Origin Location (Source)"
                  placeholder="e.g. Mumbai Port"
                  value={form.source}
                  onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                  error={formErrors.source}
                  required
                />
                <Input
                  label="Destination Location"
                  placeholder="e.g. Nagpur Logistics Hub"
                  value={form.destination}
                  onChange={(e) => setForm(prev => ({ ...prev, destination: e.target.value }))}
                  error={formErrors.destination}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Assign Vehicle"
                  type="select"
                  value={form.vehicle}
                  onChange={(e) => setForm(prev => ({ ...prev, vehicle: e.target.value }))}
                  error={formErrors.vehicle}
                  options={[
                    { value: '', label: 'Select available vehicle' },
                    ...vehicles.filter(v => v.status === 'AVAILABLE').map(v => ({ value: String(v.id), label: `${v.registration_number} - ${v.vehicle_name}` }))
                  ]}
                  required
                />
                <Input
                  label="Assign Driver"
                  type="select"
                  value={form.driver}
                  onChange={(e) => setForm(prev => ({ ...prev, driver: e.target.value }))}
                  error={formErrors.driver}
                  options={[
                    { value: '', label: 'Select available driver' },
                    ...drivers.filter(d => d.status === 'AVAILABLE').map(d => ({ value: String(d.id), label: d.name }))
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Cargo Load (tons)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 12.50"
                  value={form.cargo_weight}
                  onChange={(e) => setForm(prev => ({ ...prev, cargo_weight: e.target.value }))}
                  error={formErrors.cargo_weight}
                  required
                />
                <Input
                  label="Planned Distance (km)"
                  type="number"
                  placeholder="e.g. 850"
                  value={form.planned_distance}
                  onChange={(e) => setForm(prev => ({ ...prev, planned_distance: e.target.value }))}
                  error={formErrors.planned_distance}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contract Revenue"
                  type="number"
                  placeholder="e.g. 75000"
                  value={form.revenue}
                  onChange={(e) => setForm(prev => ({ ...prev, revenue: e.target.value }))}
                  error={formErrors.revenue}
                  required
                />
                <Input
                  label="Dispatch Status"
                  type="select"
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                  options={[
                    { value: 'DRAFT', label: 'Draft' },
                    { value: 'DISPATCHED', label: 'Dispatched (On Trip)' }
                  ]}
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Overlay Modal */}
      {isCompleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-sm leading-6">
                Complete Trip Logs
              </h3>
              <button onClick={() => setIsCompleteOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCompleteSubmit} className="p-6 space-y-4">
              <Input
                label="Actual Distance Traveled (km)"
                type="number"
                placeholder="e.g. 862"
                value={completeForm.actual_distance}
                onChange={(e) => setCompleteForm(prev => ({ ...prev, actual_distance: e.target.value }))}
                error={completeErrors.actual_distance}
                required
              />
              <Input
                label="Total Fuel Consumed (liters)"
                type="number"
                step="0.01"
                placeholder="e.g. 240.50"
                value={completeForm.fuel_consumed}
                onChange={(e) => setCompleteForm(prev => ({ ...prev, fuel_consumed: e.target.value }))}
                error={completeErrors.fuel_consumed}
                required
              />

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4">
                <Button variant="outline" onClick={() => setIsCompleteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="bg-green-600 hover:bg-green-700">
                  Record Completion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

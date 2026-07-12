import React, { useState, useEffect } from 'react';
import { fuelService } from '../services/fuelService';
import { vehicleService } from '../services/vehicleService';
import { tripService } from '../services/tripService';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function Fuel() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    vehicle: '',
    trip: '',
    liters: '',
    cost: '',
    odometer: '',
    fuel_date: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fuelData, vehiclesData, tripsData] = await Promise.all([
        fuelService.getAll(),
        vehicleService.getAll(),
        tripService.getAll()
      ]);
      setFuelLogs(fuelData);
      setVehicles(vehiclesData);
      setTrips(tripsData);
    } catch (err) {
      console.error('Failed to load fuel records:', err);
      setError('Could not retrieve fuel logging ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      vehicle: '',
      trip: '',
      liters: '',
      cost: '',
      odometer: '',
      fuel_date: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (log) => {
    setEditingId(log.id);
    setForm({
      vehicle: log.vehicle,
      trip: log.trip || '',
      liters: log.liters,
      cost: log.cost,
      odometer: log.odometer,
      fuel_date: log.fuel_date
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.vehicle) errors.vehicle = 'Selecting a vehicle is required';
    if (!form.liters || parseFloat(form.liters) <= 0) {
      errors.liters = 'Liters refueled must be greater than 0';
    }
    if (!form.cost || parseFloat(form.cost) <= 0) {
      errors.cost = 'Fuel refill cost must be greater than 0';
    }
    if (!form.odometer || parseFloat(form.odometer) < 0) {
      errors.odometer = 'Odometer reading is required';
    }
    if (!form.fuel_date) errors.fuel_date = 'Date of refueling is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...form,
      vehicle: parseInt(form.vehicle),
      trip: form.trip === '' ? null : parseInt(form.trip),
      liters: parseFloat(form.liters),
      cost: parseFloat(form.cost),
      odometer: parseFloat(form.odometer)
    };

    try {
      if (editingId) {
        await fuelService.update(editingId, payload);
      } else {
        await fuelService.create(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save fuel log:', err);
      setError('Operation failed. Verify entry details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fuel log?')) return;
    try {
      await fuelService.delete(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete fuel log:', err);
      setError('Could not delete fuel log entry.');
    }
  };

  const getVehicleReg = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    return vehicle ? vehicle.registration_number : `ID: #${id}`;
  };

  const getTripDetails = (id) => {
    if (!id) return 'Unlinked / General';
    const trip = trips.find(t => t.id === id);
    return trip ? `${trip.source} → ${trip.destination}` : `Trip ID: #${id}`;
  };

  // Search query filter
  const filteredLogs = fuelLogs.filter(log =>
    getVehicleReg(log.vehicle).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTripDetails(log.trip).toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.fuel_date.includes(searchTerm)
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
          <h3 className="text-slate-800 text-base font-semibold">Fuel Refills Ledger</h3>
          <p className="text-xs text-slate-500 mt-1">Track fuel logs, monitor total liters consumed, and compute mileage costs.</p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          <Plus className="h-4 w-4" />
          <span>Log Fuel Refill</span>
        </Button>
      </div>

      {/* Fuel logs table list */}
      <Table
        headers={['Vehicle No.', 'Linked Trip Route', 'Refueled Liters', 'Total Cost', 'Price per Liter', 'Odometer Reading', 'Fuel Date', 'Actions']}
        data={filteredLogs}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No fuel logs logged in the ledger."
        renderRow={(log) => {
          const pricePerLiter = log.liters > 0 ? log.cost / log.liters : 0;
          return (
            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-3.5 align-middle text-slate-850 font-bold text-xs">{getVehicleReg(log.vehicle)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-600 text-xs font-semibold max-w-xs truncate">{getTripDetails(log.trip)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-650 text-xs font-semibold">{log.liters} L</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 font-bold text-xs">{formatCurrency(log.cost)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-medium">{formatCurrency(pricePerLiter)}/L</td>
              <td className="px-6 py-3.5 align-middle text-slate-650 text-xs font-semibold">{parseFloat(log.odometer).toLocaleString()} km</td>
              <td className="px-6 py-3.5 align-middle text-slate-550 text-xs font-medium">{log.fuel_date}</td>
              <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(log)} className="!p-1.5">
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(log.id)} className="!p-1.5 hover:bg-red-50 hover:border-red-200">
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-sm leading-6">
                {editingId ? 'Edit Fuel Refill Log' : 'Log Fuel Refill'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Select Vehicle"
                  type="select"
                  value={form.vehicle}
                  onChange={(e) => setForm(prev => ({ ...prev, vehicle: e.target.value }))}
                  error={formErrors.vehicle}
                  options={[
                    { value: '', label: 'Select vehicle' },
                    ...vehicles.map(v => ({ value: String(v.id), label: `${v.registration_number} - ${v.vehicle_name}` }))
                  ]}
                  required
                />
                <Input
                  label="Link to active Trip (Optional)"
                  type="select"
                  value={form.trip}
                  onChange={(e) => setForm(prev => ({ ...prev, trip: e.target.value }))}
                  options={[
                    { value: '', label: 'None - General refuel' },
                    ...trips.filter(t => t.status === 'DISPATCHED' || t.status === 'COMPLETED').map(t => ({ value: String(t.id), label: `${t.source} → ${t.destination}` }))
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Refueled Liters"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 150.00"
                  value={form.liters}
                  onChange={(e) => setForm(prev => ({ ...prev, liters: e.target.value }))}
                  error={formErrors.liters}
                  required
                />
                <Input
                  label="Total Cost"
                  type="number"
                  placeholder="e.g. 14000"
                  value={form.cost}
                  onChange={(e) => setForm(prev => ({ ...prev, cost: e.target.value }))}
                  error={formErrors.cost}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Current Odometer (km)"
                  type="number"
                  placeholder="e.g. 45020"
                  value={form.odometer}
                  onChange={(e) => setForm(prev => ({ ...prev, odometer: e.target.value }))}
                  error={formErrors.odometer}
                  required
                />
                <Input
                  label="Fueling Date"
                  type="date"
                  value={form.fuel_date}
                  onChange={(e) => setForm(prev => ({ ...prev, fuel_date: e.target.value }))}
                  error={formErrors.fuel_date}
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Record Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

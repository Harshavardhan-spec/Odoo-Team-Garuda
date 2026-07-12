import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    registration_number: '',
    vehicle_name: '',
    vehicle_type: 'TRUCK',
    max_load_capacity: '',
    odometer: '0',
    acquisition_cost: '',
    fuel_type: 'DIESEL',
    current_location: '',
    status: 'AVAILABLE'
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
      setError('Could not fetch vehicles database catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      registration_number: '',
      vehicle_name: '',
      vehicle_type: 'TRUCK',
      max_load_capacity: '',
      odometer: '0',
      acquisition_cost: '',
      fuel_type: 'DIESEL',
      current_location: '',
      status: 'AVAILABLE'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      registration_number: vehicle.registration_number,
      vehicle_name: vehicle.vehicle_name,
      vehicle_type: vehicle.vehicle_type,
      max_load_capacity: vehicle.max_load_capacity,
      odometer: vehicle.odometer,
      acquisition_cost: vehicle.acquisition_cost,
      fuel_type: vehicle.fuel_type,
      current_location: vehicle.current_location,
      status: vehicle.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.registration_number.trim()) errors.registration_number = 'Registration number is required';
    if (!form.vehicle_name.trim()) errors.vehicle_name = 'Vehicle name is required';
    if (!form.max_load_capacity || parseFloat(form.max_load_capacity) <= 0) {
      errors.max_load_capacity = 'Max load capacity must be greater than 0';
    }
    if (!form.acquisition_cost || parseFloat(form.acquisition_cost) <= 0) {
      errors.acquisition_cost = 'Acquisition cost must be greater than 0';
    }
    if (parseFloat(form.odometer) < 0) {
      errors.odometer = 'Odometer reading cannot be negative';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await vehicleService.update(editingId, form);
      } else {
        await vehicleService.create(form);
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      console.error('Failed to submit vehicle:', err);
      const backendError = err.response?.data?.registration_number?.[0] || 'Operation failed. Verify input details.';
      setFormErrors({ registration_number: backendError });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleService.delete(id);
      fetchVehicles();
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      setError('Could not delete vehicle. Verify if it is currently assigned to active trips.');
    }
  };

  // Filter vehicles matching search query
  const filteredVehicles = vehicles.filter(v =>
    v.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.current_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatting currency
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
          <h3 className="text-slate-800 text-base font-semibold">Active Fleet</h3>
          <p className="text-xs text-slate-500 mt-1">Configure registrations and track statuses.</p>
        </div>
        <Button onClick={openAddModal} variant="primary" className="shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Register Vehicle</span>
        </Button>
      </div>

      {/* Vehicles Database list */}
      <Table
        headers={['Registration No.', 'Vehicle Name', 'Type', 'Fuel Type', 'Odometer (km)', 'Capacity (t)', 'Cost', 'Location', 'Status', 'Actions']}
        data={filteredVehicles}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No vehicles registered in the catalog."
        renderRow={(v) => {
          const statusColors = {
            'AVAILABLE': 'bg-green-50 text-green-700 border-green-200',
            'ON_TRIP': 'bg-blue-50 text-blue-700 border-blue-200',
            'IN_SHOP': 'bg-amber-50 text-amber-700 border-amber-200',
            'RETIRED': 'bg-slate-50 text-slate-500 border-slate-200'
          };
          return (
            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-3.5 align-middle text-slate-850 font-bold text-xs">{v.registration_number}</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 font-semibold text-xs">{v.vehicle_name}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-semibold">{v.vehicle_type}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-semibold">{v.fuel_type}</td>
              <td className="px-6 py-3.5 align-middle text-slate-650 text-xs font-semibold">{parseFloat(v.odometer).toLocaleString()}</td>
              <td className="px-6 py-3.5 align-middle text-slate-650 text-xs font-semibold">{v.max_load_capacity} tons</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 font-bold text-xs">{formatCurrency(v.acquisition_cost)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-medium">{v.current_location || 'Depot'}</td>
              <td className="px-6 py-3.5 align-middle">
                <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold border ${statusColors[v.status] || 'bg-slate-100'}`}>
                  {v.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(v)} className="!p-1.5">
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(v.id)} className="!p-1.5 hover:bg-red-50 hover:border-red-200">
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
                {editingId ? 'Edit Vehicle Details' : 'Register New Vehicle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Registration Number"
                  placeholder="e.g. MH-12-PQ-9999"
                  value={form.registration_number}
                  onChange={(e) => setForm(prev => ({ ...prev, registration_number: e.target.value.toUpperCase() }))}
                  error={formErrors.registration_number}
                  required
                />
                <Input
                  label="Vehicle Nickname / Model"
                  placeholder="e.g. Tata Prima 4025.S"
                  value={form.vehicle_name}
                  onChange={(e) => setForm(prev => ({ ...prev, vehicle_name: e.target.value }))}
                  error={formErrors.vehicle_name}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Vehicle Type"
                  type="select"
                  value={form.vehicle_type}
                  onChange={(e) => setForm(prev => ({ ...prev, vehicle_type: e.target.value }))}
                  options={[
                    { value: 'TRUCK', label: 'Truck' },
                    { value: 'VAN', label: 'Van' },
                    { value: 'BUS', label: 'Bus' },
                    { value: 'CAR', label: 'Car' }
                  ]}
                />
                <Input
                  label="Fuel Type"
                  type="select"
                  value={form.fuel_type}
                  onChange={(e) => setForm(prev => ({ ...prev, fuel_type: e.target.value }))}
                  options={[
                    { value: 'DIESEL', label: 'Diesel' },
                    { value: 'PETROL', label: 'Petrol' },
                    { value: 'CNG', label: 'CNG' },
                    { value: 'EV', label: 'Electric' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Odometer Reading (km)"
                  type="number"
                  placeholder="0"
                  value={form.odometer}
                  onChange={(e) => setForm(prev => ({ ...prev, odometer: e.target.value }))}
                  error={formErrors.odometer}
                  required
                />
                <Input
                  label="Max Load Capacity (tons)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 15.00"
                  value={form.max_load_capacity}
                  onChange={(e) => setForm(prev => ({ ...prev, max_load_capacity: e.target.value }))}
                  error={formErrors.max_load_capacity}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Acquisition Cost"
                  type="number"
                  placeholder="e.g. 3500000"
                  value={form.acquisition_cost}
                  onChange={(e) => setForm(prev => ({ ...prev, acquisition_cost: e.target.value }))}
                  error={formErrors.acquisition_cost}
                  required
                />
                <Input
                  label="Current Location"
                  placeholder="e.g. Mumbai Depot"
                  value={form.current_location}
                  onChange={(e) => setForm(prev => ({ ...prev, current_location: e.target.value }))}
                />
              </div>

              <Input
                label="Operational Status"
                type="select"
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                options={[
                  { value: 'AVAILABLE', label: 'Available' },
                  { value: 'ON_TRIP', label: 'On Trip' },
                  { value: 'IN_SHOP', label: 'In Shop (Maintenance)' },
                  { value: 'RETIRED', label: 'Retired' }
                ]}
              />

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


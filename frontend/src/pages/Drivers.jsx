import React, { useState, useEffect } from 'react';
import { driverService } from '../services/driverService';
import { vehicleService } from '../services/vehicleService';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    license_number: '',
    phone_number: '',
    emergency_contact: '',
    assigned_vehicle: '',
    license_category: '',
    license_expiry: '',
    safety_score: '100',
    status: 'AVAILABLE'
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driversData, vehiclesData] = await Promise.all([
        driverService.getAll(),
        vehicleService.getAll()
      ]);
      setDrivers(driversData);
      setVehicles(vehiclesData);
    } catch (err) {
      console.error('Failed to load drivers information:', err);
      setError('Could not retrieve driver registry records.');
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
      name: '',
      license_number: '',
      phone_number: '',
      emergency_contact: '',
      assigned_vehicle: '',
      license_category: '',
      license_expiry: '',
      safety_score: '100',
      status: 'AVAILABLE'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingId(driver.id);
    setForm({
      name: driver.name,
      license_number: driver.license_number,
      phone_number: driver.phone_number,
      emergency_contact: driver.emergency_contact || '',
      assigned_vehicle: driver.assigned_vehicle || '',
      license_category: driver.license_category,
      license_expiry: driver.license_expiry,
      safety_score: driver.safety_score,
      status: driver.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Driver name is required';
    if (!form.license_number.trim()) errors.license_number = 'License number is required';
    if (!form.phone_number.trim()) errors.phone_number = 'Phone number is required';
    if (!form.license_category.trim()) errors.license_category = 'License category is required';
    if (!form.license_expiry) errors.license_expiry = 'License expiry date is required';
    
    const score = parseFloat(form.safety_score);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.safety_score = 'Safety score must be between 0 and 100';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build payload (handle empty assigned vehicle as null)
    const payload = {
      ...form,
      assigned_vehicle: form.assigned_vehicle === '' ? null : parseInt(form.assigned_vehicle)
    };

    try {
      if (editingId) {
        await driverService.update(editingId, payload);
      } else {
        await driverService.create(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save driver:', err);
      const backendError = err.response?.data?.license_number?.[0] || 'Operation failed. Verify entry details.';
      setFormErrors({ license_number: backendError });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      await driverService.delete(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete driver:', err);
      setError('Could not delete driver record. Check if they are currently assigned to active trips.');
    }
  };

  // Helper to map vehicle ID to registration number
  const getVehicleReg = (id) => {
    if (!id) return 'Unassigned';
    const vehicle = vehicles.find(v => v.id === id);
    return vehicle ? `${vehicle.registration_number} (${vehicle.vehicle_name})` : `ID: #${id}`;
  };

  // Filter list matching query
  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone_number.includes(searchTerm)
  );

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
          <h3 className="text-slate-800 text-base font-semibold">Drivers Registry</h3>
          <p className="text-xs text-slate-500 mt-1">Manage personnel, safety scores, and vehicle duty assignments.</p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          <Plus className="h-4 w-4" />
          <span>Onboard Driver</span>
        </Button>
      </div>

      {/* Drivers List Table */}
      <Table
        headers={['Name', 'License No.', 'Category', 'Expiry', 'Phone', 'Safety Score', 'Assigned Vehicle', 'Status', 'Actions']}
        data={filteredDrivers}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No drivers onboarded in the directory."
        renderRow={(d) => {
          const statusColors = {
            'AVAILABLE': 'bg-green-50 text-green-700 border-green-200',
            'ON_TRIP': 'bg-blue-50 text-blue-700 border-blue-200',
            'OFF_DUTY': 'bg-slate-50 text-slate-500 border-slate-200',
            'SUSPENDED': 'bg-red-50 text-red-700 border-red-200'
          };
          return (
            <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-3.5 align-middle text-slate-850 font-bold text-xs">{d.name}</td>
              <td className="px-6 py-3.5 align-middle text-slate-650 text-xs font-semibold">{d.license_number}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-semibold">{d.license_category}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-medium">{d.license_expiry}</td>
              <td className="px-6 py-3.5 align-middle text-slate-600 text-xs font-semibold">{d.phone_number}</td>
              <td className="px-6 py-3.5 align-middle">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${parseFloat(d.safety_score) >= 85 ? 'bg-green-50 text-green-750' : 'bg-amber-50 text-amber-700'}`}>
                  {parseFloat(d.safety_score).toFixed(0)} / 100
                </span>
              </td>
              <td className="px-6 py-3.5 align-middle text-slate-600 text-xs font-medium truncate max-w-xs">{getVehicleReg(d.assigned_vehicle)}</td>
              <td className="px-6 py-3.5 align-middle">
                <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold border ${statusColors[d.status] || 'bg-slate-100'}`}>
                  {d.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(d)} className="!p-1.5">
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(d.id)} className="!p-1.5 hover:bg-red-50 hover:border-red-200">
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      {/* Modal Overlay Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-sm leading-6">
                {editingId ? 'Edit Driver Details' : 'Onboard New Driver'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  error={formErrors.name}
                  required
                />
                <Input
                  label="License Number"
                  placeholder="e.g. DL-142011006899"
                  value={form.license_number}
                  onChange={(e) => setForm(prev => ({ ...prev, license_number: e.target.value.toUpperCase() }))}
                  error={formErrors.license_number}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="License Category"
                  placeholder="e.g. LMV / HGV"
                  value={form.license_category}
                  onChange={(e) => setForm(prev => ({ ...prev, license_category: e.target.value.toUpperCase() }))}
                  error={formErrors.license_category}
                  required
                />
                <Input
                  label="License Expiration Date"
                  type="date"
                  value={form.license_expiry}
                  onChange={(e) => setForm(prev => ({ ...prev, license_expiry: e.target.value }))}
                  error={formErrors.license_expiry}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  placeholder="e.g. +91 9876543210"
                  value={form.phone_number}
                  onChange={(e) => setForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  error={formErrors.phone_number}
                  required
                />
                <Input
                  label="Emergency Contact No."
                  placeholder="e.g. +91 9999888877"
                  value={form.emergency_contact}
                  onChange={(e) => setForm(prev => ({ ...prev, emergency_contact: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Assigned Vehicle"
                  type="select"
                  value={form.assigned_vehicle}
                  onChange={(e) => setForm(prev => ({ ...prev, assigned_vehicle: e.target.value }))}
                  options={[
                    { value: '', label: 'None' },
                    ...vehicles.map(v => ({ value: String(v.id), label: `${v.registration_number} - ${v.vehicle_name}` }))
                  ]}
                />
                <Input
                  label="Driver Safety Score"
                  type="number"
                  placeholder="100"
                  value={form.safety_score}
                  onChange={(e) => setForm(prev => ({ ...prev, safety_score: e.target.value }))}
                  error={formErrors.safety_score}
                  required
                />
              </div>

              <Input
                label="Duty Status"
                type="select"
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                options={[
                  { value: 'AVAILABLE', label: 'Available' },
                  { value: 'ON_TRIP', label: 'On Trip' },
                  { value: 'OFF_DUTY', label: 'Off Duty' },
                  { value: 'SUSPENDED', label: 'Suspended' }
                ]}
              />

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Driver
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

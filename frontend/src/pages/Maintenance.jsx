import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import { vehicleService } from '../services/vehicleService';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function Maintenance() {
  const [maintenances, setMaintenances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    vehicle: '',
    maintenance_type: '',
    description: '',
    cost: '',
    start_date: '',
    end_date: '',
    status: 'ACTIVE'
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintenanceData, vehiclesData] = await Promise.all([
        maintenanceService.getAll(),
        vehicleService.getAll()
      ]);
      setMaintenances(maintenanceData);
      setVehicles(vehiclesData);
    } catch (err) {
      console.error('Failed to load maintenance records:', err);
      setError('Could not retrieve vehicle maintenance logs.');
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
      maintenance_type: '',
      description: '',
      cost: '',
      start_date: '',
      end_date: '',
      status: 'ACTIVE'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingId(m.id);
    setForm({
      vehicle: m.vehicle,
      maintenance_type: m.maintenance_type,
      description: m.description || '',
      cost: m.cost,
      start_date: m.start_date,
      end_date: m.end_date || '',
      status: m.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.vehicle) errors.vehicle = 'Assigning a vehicle is required';
    if (!form.maintenance_type.trim()) errors.maintenance_type = 'Maintenance category / type is required';
    if (!form.cost || parseFloat(form.cost) < 0) {
      errors.cost = 'Valid cost amount is required';
    }
    if (!form.start_date) errors.start_date = 'Start date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert types
    const payload = {
      ...form,
      vehicle: parseInt(form.vehicle),
      cost: parseFloat(form.cost),
      end_date: form.end_date === '' ? null : form.end_date
    };

    try {
      if (editingId) {
        await maintenanceService.update(editingId, payload);
      } else {
        await maintenanceService.create(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to submit maintenance job:', err);
      setError('Operation failed. Verify entry details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) return;
    try {
      await maintenanceService.delete(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete maintenance record:', err);
      setError('Could not delete maintenance record.');
    }
  };

  const getVehicleReg = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    return vehicle ? vehicle.registration_number : `ID: #${id}`;
  };

  // Search filtering
  const filteredMaintenances = maintenances.filter(m =>
    m.maintenance_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    getVehicleReg(m.vehicle).toLowerCase().includes(searchTerm.toLowerCase())
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
          <h3 className="text-slate-800 text-base font-semibold">Maintenance Records</h3>
          <p className="text-xs text-slate-500 mt-1">Schedule servicing, log workshop costs, and monitor active repairs.</p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          <Plus className="h-4 w-4" />
          <span>Schedule Maintenance</span>
        </Button>
      </div>

      {/* Maintenance Table List */}
      <Table
        headers={['Vehicle No.', 'Job Type', 'Description', 'Cost', 'Start Date', 'Completion Date', 'Status', 'Actions']}
        data={filteredMaintenances}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No maintenance records booked in the database."
        renderRow={(m) => {
          const statusColors = {
            'ACTIVE': 'bg-amber-50 text-amber-700 border-amber-200',
            'COMPLETED': 'bg-green-50 text-green-700 border-green-200'
          };
          return (
            <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-3.5 align-middle text-slate-850 font-bold text-xs">{getVehicleReg(m.vehicle)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 font-semibold text-xs">{m.maintenance_type}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-medium max-w-xs truncate" title={m.description}>{m.description || 'No description provided.'}</td>
              <td className="px-6 py-3.5 align-middle text-slate-700 font-bold text-xs">{formatCurrency(m.cost)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-550 text-xs font-medium">{m.start_date}</td>
              <td className="px-6 py-3.5 align-middle text-slate-550 text-xs font-medium">{m.end_date || 'In Progress'}</td>
              <td className="px-6 py-3.5 align-middle">
                <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold border ${statusColors[m.status] || 'bg-slate-100'}`}>
                  {m.status}
                </span>
              </td>
              <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(m)} className="!p-1.5">
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(m.id)} className="!p-1.5 hover:bg-red-50 hover:border-red-200">
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
                {editingId ? 'Edit Maintenance Record' : 'Schedule New Maintenance'}
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
                  label="Job Category / Type"
                  placeholder="e.g. Engine Tuning / Tire Replacement"
                  value={form.maintenance_type}
                  onChange={(e) => setForm(prev => ({ ...prev, maintenance_type: e.target.value }))}
                  error={formErrors.maintenance_type}
                  required
                />
              </div>

              <Input
                label="Repair Description"
                type="textarea"
                placeholder="Details of defects, tasks completed, parts replaced..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Repair Cost"
                  type="number"
                  placeholder="e.g. 15000"
                  value={form.cost}
                  onChange={(e) => setForm(prev => ({ ...prev, cost: e.target.value }))}
                  error={formErrors.cost}
                  required
                />
                <Input
                  label="Status"
                  type="select"
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                  options={[
                    { value: 'ACTIVE', label: 'Active (Workshop)' },
                    { value: 'COMPLETED', label: 'Completed' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                  error={formErrors.start_date}
                  required
                />
                <Input
                  label="End Date (Optional)"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Record Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

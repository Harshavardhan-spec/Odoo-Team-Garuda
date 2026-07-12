import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { vehicleService } from '../services/vehicleService';
import { tripService } from '../services/tripService';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
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
    expense_type: 'TOLL',
    amount: '',
    description: '',
    expense_date: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesData, vehiclesData, tripsData] = await Promise.all([
        expenseService.getAll(),
        vehicleService.getAll(),
        tripService.getAll()
      ]);
      setExpenses(expensesData);
      setVehicles(vehiclesData);
      setTrips(tripsData);
    } catch (err) {
      console.error('Failed to load expenses database:', err);
      setError('Could not retrieve operational expenses ledger.');
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
      expense_type: 'TOLL',
      amount: '',
      description: '',
      expense_date: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingId(exp.id);
    setForm({
      vehicle: exp.vehicle,
      trip: exp.trip || '',
      expense_type: exp.expense_type,
      amount: exp.amount,
      description: exp.description || '',
      expense_date: exp.expense_date,
      remarks: exp.remarks || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.vehicle) errors.vehicle = 'Assigning a vehicle is required';
    if (!form.amount || parseFloat(form.amount) <= 0) {
      errors.amount = 'Expense amount must be greater than 0';
    }
    if (!form.expense_date) errors.expense_date = 'Refill date is required';
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
      amount: parseFloat(form.amount)
    };

    try {
      if (editingId) {
        await expenseService.update(editingId, payload);
      } else {
        await expenseService.create(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to submit expense:', err);
      setError('Operation failed. Verify entry details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await expenseService.delete(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete expense log:', err);
      setError('Could not delete expense log.');
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

  // Search filtering
  const filteredExpenses = expenses.filter(exp =>
    getVehicleReg(exp.vehicle).toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.expense_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp.description && exp.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h3 className="text-slate-800 text-base font-semibold">Operational Expenses</h3>
          <p className="text-xs text-slate-500 mt-1">Book fleet operation costs, link expenditures, and review financial logs.</p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          <Plus className="h-4 w-4" />
          <span>Log Expense</span>
        </Button>
      </div>

      {/* Expenses list table */}
      <Table
        headers={['Vehicle No.', 'Linked Trip Route', 'Expense Category', 'Amount', 'Date', 'Description', 'Remarks', 'Actions']}
        data={filteredExpenses}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No operational expenses booked in the ledger."
        renderRow={(exp) => {
          const categoryColors = {
            'FUEL': 'bg-blue-50 text-blue-700 border-blue-100',
            'MAINTENANCE': 'bg-amber-50 text-amber-700 border-amber-100',
            'TOLL': 'bg-indigo-50 text-indigo-705 border-indigo-100',
            'INSURANCE': 'bg-green-50 text-green-700 border-green-100',
            'OTHER': 'bg-slate-55 text-slate-600 border-slate-100'
          };
          return (
            <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-3.5 align-middle text-slate-850 font-bold text-xs">{getVehicleReg(exp.vehicle)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-600 text-xs font-semibold max-w-xs truncate">{getTripDetails(exp.trip)}</td>
              <td className="px-6 py-3.5 align-middle">
                <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold border ${categoryColors[exp.expense_type] || 'bg-slate-100 text-slate-650'}`}>
                  {exp.expense_type}
                </span>
              </td>
              <td className="px-6 py-3.5 align-middle text-slate-800 font-extrabold text-xs">{formatCurrency(exp.amount)}</td>
              <td className="px-6 py-3.5 align-middle text-slate-550 text-xs font-medium">{exp.expense_date}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-medium max-w-xs truncate" title={exp.description}>{exp.description || '-'}</td>
              <td className="px-6 py-3.5 align-middle text-slate-500 text-xs font-medium max-w-xs truncate" title={exp.remarks}>{exp.remarks || '-'}</td>
              <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(exp)} className="!p-1.5">
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(exp.id)} className="!p-1.5 hover:bg-red-50 hover:border-red-200">
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
                {editingId ? 'Edit Expense Record' : 'Record New Expense'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Assign to Vehicle"
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
                    { value: '', label: 'None' },
                    ...trips.filter(t => t.status === 'DISPATCHED' || t.status === 'COMPLETED').map(t => ({ value: String(t.id), label: `${t.source} → ${t.destination}` }))
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Expense Category"
                  type="select"
                  value={form.expense_type}
                  onChange={(e) => setForm(prev => ({ ...prev, expense_type: e.target.value }))}
                  options={[
                    { value: 'TOLL', label: 'Toll Fees' },
                    { value: 'FUEL', label: 'Fuel Refill' },
                    { value: 'MAINTENANCE', label: 'Maintenance' },
                    { value: 'INSURANCE', label: 'Insurance Premium' },
                    { value: 'OTHER', label: 'Other Costs' }
                  ]}
                />
                <Input
                  label="Expense Amount"
                  type="number"
                  placeholder="e.g. 2500"
                  value={form.amount}
                  onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  error={formErrors.amount}
                  required
                />
              </div>

              <Input
                label="Expense Date"
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm(prev => ({ ...prev, expense_date: e.target.value }))}
                error={formErrors.expense_date}
                required
              />

              <Input
                label="Description"
                placeholder="Brief justification or transaction details..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              />

              <Input
                label="Remarks"
                placeholder="Additional audit notes, payment modes..."
                value={form.remarks}
                onChange={(e) => setForm(prev => ({ ...prev, remarks: e.target.value }))}
              />

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Record Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

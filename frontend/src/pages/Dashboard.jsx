import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { maintenanceService } from '../services/maintenanceService';
import Card from '../components/Card';
import Table from '../components/Table';
import {
  Truck,
  Users,
  Compass,
  Wrench,
  Fuel as FuelIcon,
  Receipt,
  TrendingUp,
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const isReportsTab = location.search.includes('tab=reports');

  // Dashboard Overview States
  const [overview, setOverview] = useState(null);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Reports States
  const [fleetReport, setFleetReport] = useState(null);
  const [expenseReport, setExpenseReport] = useState(null);
  const [fuelReport, setFuelReport] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start_date: '', end_date: '' });

  // Load Dashboard Data
  useEffect(() => {
    if (!isReportsTab) {
      const fetchOverviewData = async () => {
        try {
          setLoadingOverview(true);
          const data = await dashboardService.getOverview();
          setOverview(data);
          
          // Also fetch recent maintenance directly from maintenance list
          const maintenance = await maintenanceService.getAll();
          setRecentMaintenance(maintenance.slice(0, 5));
        } catch (err) {
          console.error('Failed to load dashboard statistics:', err);
        } finally {
          setLoadingOverview(false);
        }
      };
      fetchOverviewData();
    }
  }, [isReportsTab]);

  // Load Reports Data
  useEffect(() => {
    if (isReportsTab) {
      const fetchReportsData = async () => {
        try {
          setLoadingReports(true);
          const filterParams = {};
          if (dateFilter.start_date) filterParams.start_date = dateFilter.start_date;
          if (dateFilter.end_date) filterParams.end_date = dateFilter.end_date;

          const fleetData = await dashboardService.getFleetReport(filterParams);
          const expenseData = await dashboardService.getExpenseReport(filterParams);
          const fuelData = await dashboardService.getFuelReport(filterParams);

          setFleetReport(fleetData);
          setExpenseReport(expenseData);
          setFuelReport(fuelData);
        } catch (err) {
          console.error('Failed to load analytical reports:', err);
        } finally {
          setLoadingReports(false);
        }
      };
      fetchReportsData();
    }
  }, [isReportsTab, dateFilter]);

  // Helper to format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  if (isReportsTab) {
    // --- REPORTS TAB UI ---
    return (
      <div className="space-y-6">
        {/* Date Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
              <input
                type="date"
                value={dateFilter.start_date}
                onChange={(e) => setDateFilter(prev => ({ ...prev, start_date: e.target.value }))}
                className="block w-full text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
              <input
                type="date"
                value={dateFilter.end_date}
                onChange={(e) => setDateFilter(prev => ({ ...prev, end_date: e.target.value }))}
                className="block w-full text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => setDateFilter({ start_date: '', end_date: '' })}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {loadingReports ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-40 bg-slate-200 rounded-xl"></div>
            <div className="h-40 bg-slate-200 rounded-xl"></div>
            <div className="h-40 bg-slate-200 rounded-xl"></div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Reports Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Fleet Performance Metrics">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 text-xs font-medium">Total Distance Traveled</span>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                      {fleetReport?.total_miles_driven?.toLocaleString() || 0} <span className="text-sm font-normal text-slate-500">km</span>
                    </h3>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-xs font-medium">Active Fleet Ratio</span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(fleetReport?.active_vehicles_ratio || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 shrink-0">
                        {Math.round((fleetReport?.active_vehicles_ratio || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Fuel Efficiency Analytics">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 text-xs font-medium">Total Refueled Liters</span>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                      {fuelReport?.total_liters?.toLocaleString() || 0} <span className="text-sm font-normal text-slate-500">L</span>
                    </h3>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-xs font-medium">Avg Fuel Consumption</span>
                    <h3 className="text-xl font-bold text-slate-700 mt-1">
                      {fuelReport?.avg_liters_per_100km || 0} <span className="text-xs font-medium text-slate-500">L / 100 km</span>
                    </h3>
                  </div>
                </div>
              </Card>

              <Card title="Total Operating Expenses">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 text-xs font-medium">Accumulated Expenses</span>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                      {formatCurrency(expenseReport?.total_sum)}
                    </h3>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-xs font-medium">Linked Fuel Refill Cost</span>
                    <h3 className="text-xl font-bold text-slate-700 mt-1">
                      {formatCurrency(fuelReport?.total_cost)}
                    </h3>
                  </div>
                </div>
              </Card>
            </div>

            {/* Expenses Breakdown chart and Utilization Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Expenses Category Distribution">
                {expenseReport?.breakdown ? (
                  <div className="space-y-4">
                    {Object.entries(expenseReport.breakdown).map(([category, amount]) => {
                      const percentage = expenseReport.total_sum > 0
                        ? Math.round((amount / expenseReport.total_sum) * 100)
                        : 0;
                      return (
                        <div key={category}>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                            <span>{category}</span>
                            <span>{formatCurrency(amount)} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-6">No data registered.</p>
                )}
              </Card>

              <Card title="Vehicle Utilizations">
                {fleetReport?.utilization_by_vehicle && fleetReport.utilization_by_vehicle.length > 0 ? (
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {fleetReport.utilization_by_vehicle.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <Truck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Vehicle ID: #{item.vehicle_id}</p>
                            <p className="text-xxs text-slate-500">{item.trips_count} Total Trips</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {item.distance_km.toLocaleString()} km
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-6">No utilization logs recorded.</p>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- STANDARD DASHBOARD UI ---
  const kpiList = [
    {
      label: 'Total Vehicles',
      val: (overview?.available_vehicles || 0) + (overview?.vehicles_on_trip || 0),
      icon: Truck,
      bg: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Available Vehicles',
      val: overview?.available_vehicles,
      icon: Truck,
      bg: 'bg-green-50 text-green-600',
    },
    {
      label: 'Drivers Available',
      val: overview?.drivers_available,
      icon: Users,
      bg: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Active Trips',
      val: overview?.vehicles_on_trip,
      icon: Compass,
      bg: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Maintenance Jobs',
      val: overview?.maintenance_count,
      icon: Wrench,
      bg: 'bg-red-50 text-red-600',
    },
    {
      label: 'Fuel Refills Cost',
      val: formatCurrency(overview?.total_fuel_cost),
      icon: FuelIcon,
      bg: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Operating Expenses',
      val: formatCurrency(overview?.total_expenses),
      icon: Receipt,
      bg: 'bg-slate-100 text-slate-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      {loadingOverview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {kpiList.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="space-y-2">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{kpi.label}</span>
                  <h3 className="text-2xl font-extrabold text-slate-800">{kpi.val !== undefined && kpi.val !== null ? kpi.val : 0}</h3>
                </div>
                <div className={`p-3 rounded-xl ${kpi.bg}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}

          {/* Fleet Utilization Quick Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fleet Utilization</span>
                <h3 className="text-2xl font-extrabold text-slate-800">{overview?.fleet_utilization || 0}%</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                style={{ width: `${overview?.fleet_utilization || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Lists Summary Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips Table */}
        <Table
          headers={['Origin', 'Destination', 'Vehicle ID', 'Driver Name', 'Status']}
          data={overview?.recent_trips || []}
          loading={loadingOverview}
          emptyMessage="No recent trips registered."
          renderRow={(trip) => {
            const statusColors = {
              'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
              'Dispatched': 'bg-blue-50 text-blue-700 border-blue-100',
              'Completed': 'bg-green-50 text-green-700 border-green-100',
              'Cancelled': 'bg-red-50 text-red-700 border-red-100'
            };
            return (
              <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 text-xs font-bold text-slate-800">{trip.origin}</td>
                <td className="px-6 py-3 text-xs font-bold text-slate-800">{trip.destination}</td>
                <td className="px-6 py-3 text-xs text-slate-600">{trip.vehicle_reg}</td>
                <td className="px-6 py-3 text-xs text-slate-600">{trip.driver_name}</td>
                <td className="px-6 py-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full text-xxs font-semibold border ${statusColors[trip.status] || 'bg-slate-100'}`}>
                    {trip.status}
                  </span>
                </td>
              </tr>
            );
          }}
        />

        {/* Recent Active Maintenance Table */}
        <Table
          headers={['Vehicle', 'Job Type', 'Start Date', 'Cost', 'Status']}
          data={recentMaintenance}
          loading={loadingOverview}
          emptyMessage="No active maintenance scheduling recorded."
          renderRow={(m) => {
            const statusColors = {
              'ACTIVE': 'bg-amber-50 text-amber-700 border-amber-200',
              'COMPLETED': 'bg-green-50 text-green-700 border-green-200'
            };
            return (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 text-xs font-bold text-slate-800">Vehicle ID: #{m.vehicle}</td>
                <td className="px-6 py-3 text-xs text-slate-600 font-medium">{m.maintenance_type}</td>
                <td className="px-6 py-3 text-xs text-slate-600">{m.start_date}</td>
                <td className="px-6 py-3 text-xs text-slate-700 font-bold">{formatCurrency(m.cost)}</td>
                <td className="px-6 py-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full text-xxs font-semibold border ${statusColors[m.status] || 'bg-slate-100'}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            );
          }}
        />
      </div>
    </div>
  );
}


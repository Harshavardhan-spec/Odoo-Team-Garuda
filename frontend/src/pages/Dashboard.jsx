// src/pages/Dashboard.jsx
import React from 'react';
import { Truck, Route, Wrench, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const kpiData = [
    { title: 'Active Vehicles', value: '142', icon: <Truck size={24} />, trend: '+5.2%', positive: true },
    { title: 'Ongoing Trips', value: '38', icon: <Route size={24} />, trend: '+12%', positive: true },
    { title: 'Vehicles in Repair', value: '7', icon: <Wrench size={24} />, trend: '-2.1%', positive: false },
    { title: 'Weekly Expenses', value: '$24,500', icon: <Receipt size={24} />, trend: '+1.5%', positive: false },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div className="kpi-card" key={index}>
            <div className="kpi-info">
              <span className="kpi-label">{kpi.title}</span>
              <span className="kpi-value">{kpi.value}</span>
              <span className={`kpi-trend ${kpi.positive ? 'positive' : 'negative'}`}>
                {kpi.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {kpi.trend} from last week
              </span>
            </div>
            <div className="kpi-icon-wrapper">
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-widgets">
        <div className="widget-card">
          <div className="widget-header">Recent Fleet Activity</div>
          <div className="widget-body">
            [Chart/Table Placeholder]
          </div>
        </div>
        <div className="widget-card">
          <div className="widget-header">Maintenance Alerts</div>
          <div className="widget-body">
            [Alerts List Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
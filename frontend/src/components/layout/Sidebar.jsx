// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  MapRoute, 
  Wrench, 
  Fuel, 
  Receipt, 
  BarChart3,
  Box
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed }) => {
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/vehicles', icon: <Truck size={20} />, label: 'Vehicles' },
    { path: '/drivers', icon: <Users size={20} />, label: 'Drivers' },
    { path: '/trips', icon: <MapRoute size={20} />, label: 'Trips' },
    { path: '/maintenance', icon: <Wrench size={20} />, label: 'Maintenance' },
    { path: '/fuel', icon: <Fuel size={20} />, label: 'Fuel' },
    { path: '/expenses', icon: <Receipt size={20} />, label: 'Expenses' },
    { path: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Box className="logo-icon" size={28} />
        <span>TransitOps</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
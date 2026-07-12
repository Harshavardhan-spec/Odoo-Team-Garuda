import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      <header>
        <h1>TransitOps ERP Layout Header</h1>
      </header>
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '200px', padding: '10px' }}>
          {/* 
            TODO:
            - Design professional collapsible sidebar using Lucide icons
            - Setup routing navigation paths
            - Implement user metadata log and logout actions
          */}
          <nav style={{ display: 'flex', flexDirection: 'col', gap: '8px' }}>
            <Link to="/">Dashboard</Link>
            <Link to="/vehicles">Vehicles</Link>
            <Link to="/drivers">Drivers</Link>
            <Link to="/trips">Trips</Link>
            <Link to="/maintenance">Maintenance</Link>
            <Link to="/fuel">Fuel Logs</Link>
            <Link to="/expenses">Expenses</Link>
          </nav>
        </aside>
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

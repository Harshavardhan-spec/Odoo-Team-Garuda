// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="main-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="content-wrapper">
        <Topbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
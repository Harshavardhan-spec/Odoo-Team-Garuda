// src/components/layout/Topbar.jsx
import React from 'react';
import { Menu, Search, Bell, Settings } from 'lucide-react';
import './Topbar.css';

const Topbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button onClick={toggleSidebar} className="menu-toggle">
          <Menu size={20} />
        </button>
        <div className="global-search">
          <Search className="search-icon" size={16} />
          <input type="text" placeholder="Search ERP..." />
        </div>
      </div>
      
      <div className="topbar-right">
        <button className="action-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        <button className="action-btn">
          <Settings size={20} />
        </button>
        
        <div className="user-profile">
          <div className="avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Fleet Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
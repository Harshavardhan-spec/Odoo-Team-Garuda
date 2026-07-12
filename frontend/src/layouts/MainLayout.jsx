import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Droplets,
  Receipt,
  BarChart3,
  Menu,
  Bell,
  Search,
  X,
  UserCircle2,
} from "lucide-react";

import "./MainLayout.css";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Vehicles",
      path: "/vehicles",
      icon: <Truck size={20} />,
    },
    {
      name: "Drivers",
      path: "/drivers",
      icon: <Users size={20} />,
    },
    {
      name: "Trips",
      path: "/trips",
      icon: <Route size={20} />,
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: <Wrench size={20} />,
    },
    {
      name: "Fuel",
      path: "/fuel",
      icon: <Droplets size={20} />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <Receipt size={20} />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <div className="layout">

      {/* Sidebar */}

      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>

        <div className="sidebar-header">

          <h2>Garuda Fleet</h2>

          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

        </div>

        <nav>

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}

              <span>{item.name}</span>

            </NavLink>

          ))}

        </nav>

      </aside>

      {/* Main */}

      <div className="main">

        {/* Topbar */}

        <header className="topbar">

          <div className="top-left">

            <button
              className="menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <h3>GarudaFleet</h3>

          </div>

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search..."
            />

          </div>

          <div className="top-right">

            <Bell className="icon"/>

            <UserCircle2 className="icon"/>

          </div>

        </header>

        {/* Content */}

        <main className="content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}
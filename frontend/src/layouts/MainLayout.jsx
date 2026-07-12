import React, { useState, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  Receipt,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine if a link is active based on path and query parameters
  const isLinkActive = (path, isReport = false) => {
    if (isReport) {
      return location.pathname === '/' && location.search.includes('tab=reports');
    }
    if (path === '/') {
      return location.pathname === '/' && !location.search.includes('tab=reports');
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Vehicles', path: '/vehicles', icon: Truck },
    { label: 'Drivers', path: '/drivers', icon: Users },
    { label: 'Trips', path: '/trips', icon: Route },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Fuel Logs', path: '/fuel', icon: Fuel },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Reports', path: '/?tab=reports', icon: BarChart3, isReport: true },
  ];

  // Helper to format user role name
  const formatRole = (role) => {
    if (!role) return '';
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Sidebar contents component (reused in desktop and mobile view)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Sidebar Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsSidebarOpen(false)}>
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Truck className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            TransitOps
          </span>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isLinkActive(item.path, item.isReport);
          return (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Card Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 font-semibold">
              {user?.first_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'H'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white leading-none truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || 'Hackathon Dev'}
              </p>
              <p className="text-xxs text-slate-500 mt-1 truncate">
                {formatRole(user?.role) || 'Administrator'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200">
        <div className="sticky top-0 h-screen w-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs">
          <div className="relative flex flex-col w-64 max-w-xs h-full animate-slide-in">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-xxs">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base font-semibold text-slate-800 tracking-tight">
              {isLinkActive('/vehicles') && 'Vehicles Management'}
              {isLinkActive('/drivers') && 'Drivers Directory'}
              {isLinkActive('/trips') && 'Trips Dispatch Ledger'}
              {isLinkActive('/maintenance') && 'Maintenance Records'}
              {isLinkActive('/fuel') && 'Fuel Refills Ledger'}
              {isLinkActive('/expenses') && 'Operational Expenses'}
              {isLinkActive('/', true) && 'Analytics Performance Reports'}
              {isLinkActive('/') && !location.search.includes('tab=reports') && 'Operations Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Actions Search or Notifications */}
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg relative transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            </button>

            {/* Quick user avatar name */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-4">
              <span className="text-xs font-semibold text-slate-700">
                {user?.first_name || user?.username || 'Hackathon User'}
              </span>
              <span className="text-xxs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full border border-blue-100">
                {formatRole(user?.role) || 'Dispatcher'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


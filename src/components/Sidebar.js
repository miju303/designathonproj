import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  LayoutDashboard,
  User,
  LogOut,
  Bell,
  FileText,
  Award,
  BarChart3,
  Users,
  Calendar,
  Activity,
  CheckSquare,
  ListChecks,
  ClipboardList
} from 'lucide-react';
import api from '../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useUser();
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Normalise role to lowercase for matching
  const role = user?.role ? user.role.toLowerCase() : null;
  const name = user?.name || '';
  const userId = user?.id || null;

  // Fetch unread notification count for faculty/hod
  React.useEffect(() => {
    if ((role === 'faculty' || role === 'hod') && userId) {
      const fetchCount = async () => {
        try {
          const res = await api.get(`/notifications/${userId}/unread-count`);
          setUnreadCount(res.data || 0);
        } catch (e) {
          setUnreadCount(0);
        }
      };
      fetchCount();
      const interval = setInterval(fetchCount, 30000);
      return () => clearInterval(interval);
    }
  }, [role, userId]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ── Notification icon with badge ──────────────────────────────────────────
  const NotifIcon = () => (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <Bell size={20} />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-6px',
          right: '-8px',
          background: '#ef4444',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          padding: '1px 5px',
          borderRadius: '10px',
          lineHeight: '1.4'
        }}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );

  // ── Nav items per role ─────────────────────────────────────────────────────
  const navItems = {
    faculty: [
      { name: 'Dashboard',      path: '/faculty/dashboard',  icon: <LayoutDashboard size={20} /> },
      { name: 'My Profile',     path: '/faculty-profile',    icon: <User size={20} /> },
      { name: 'Notifications',  path: '/notifications',      icon: <NotifIcon /> },
      { name: 'Calendar',       path: '/calendar',           icon: <Calendar size={20} /> },
      { name: 'Attendance',     path: '/attendance',         icon: <CheckSquare size={20} /> },
      { name: 'My Activities',  path: '/activity',           icon: <Activity size={20} /> },
      { name: 'My Assignments', path: '/my-assignments',     icon: <ListChecks size={20} /> },
      { name: 'Reports',        path: '/hod-reports',        icon: <FileText size={20} /> },
      { name: 'Achievements',   path: '/achievements',       icon: <Award size={20} /> },
    ],
    hod: [
      { name: 'Dashboard',      path: '/hod/dashboard',      icon: <LayoutDashboard size={20} /> },
      { name: 'My Profile',     path: '/faculty-profile',    icon: <User size={20} /> },
      { name: 'Notifications',  path: '/notifications',      icon: <NotifIcon /> },
      { name: 'Calendar',       path: '/calendar',           icon: <Calendar size={20} /> },
      { name: 'Attendance',     path: '/attendance',         icon: <CheckSquare size={20} /> },
      { name: 'My Activities',  path: '/activity',           icon: <Activity size={20} /> },
      { name: 'Faculty Status', path: '/hod-list',           icon: <Users size={20} /> },
      { name: 'Assignments',    path: '/manage-assignments', icon: <ClipboardList size={20} /> },
      { name: 'Reports',        path: '/hod-reports',        icon: <FileText size={20} /> },
      { name: 'Achievements',   path: '/achievements',       icon: <Award size={20} /> },
    ],
    admin: [
      { name: 'Admin Dashboard', path: '/admin/dashboard',   icon: <LayoutDashboard size={20} /> },
      { name: 'Manage Faculty',  path: '/manage-faculty',    icon: <Users size={20} /> },
      { name: 'NAAC Reports',    path: '/admin-naac',        icon: <FileText size={20} /> },
      { name: 'System Logs',     path: '/admin-logs',        icon: <BarChart3 size={20} /> },
      { name: 'Assignments',     path: '/manage-assignments',icon: <ListChecks size={20} /> },
      { name: 'Notifications',   path: '/notifications',     icon: <Bell size={20} /> },
      { name: 'Calendar',        path: '/calendar',          icon: <Calendar size={20} /> },
    ],
  };

  const currentNav = role ? (navItems[role] || []) : [];

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={sidebarStyle}>
        <SidebarHeader />
        <div style={{ padding: '24px 20px', flex: 1 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              height: '40px',
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '8px',
              marginBottom: '10px',
              animation: 'pulse 1.5s infinite'
            }} />
          ))}
        </div>
      </div>
    );
  }

  // ── No user — render minimal sidebar ──────────────────────────────────────
  if (!user) {
    return (
      <div style={sidebarStyle}>
        <SidebarHeader />
        <div style={{ padding: '20px', color: '#94a3b8', fontSize: '14px' }}>
          Session expired.{' '}
          <span
            style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/login')}
          >
            Log in again
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={sidebarStyle}>
      {/* ── Logo header ── */}
      <SidebarHeader />

      {/* ── Nav links ── */}
      <nav style={{ padding: '20px 0', flex: 1, overflowY: 'auto' }}>
        {currentNav.length === 0 && (
          <div style={{ color: '#94a3b8', padding: '12px 25px', fontSize: '14px' }}>
            No navigation available.
          </div>
        )}
        {currentNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.name}
              style={{
                padding: '12px 25px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                transition: 'all 0.18s ease',
                borderRadius: isActive ? '0 8px 8px 0' : '0',
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ flexShrink: 0, color: isActive ? '#60a5fa' : '#cbd5e1' }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '15px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#f0f9ff' : '#e2e8f0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {item.name}
              </span>
            </div>
          );
        })}
      </nav>

      {/* ── User info + logout ── */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: '700',
            fontSize: '15px',
            flexShrink: 0
          }}>
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#f1f5f9',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {name}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {user.role}
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            padding: '9px',
            background: 'rgba(239,68,68,0.1)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.18s ease',
            width: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Pulse animation for loading skeleton */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const sidebarStyle = {
  width: '260px',
  height: '100vh',
  background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  left: 0,
  top: 0,
  boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
  zIndex: 100
};

const SidebarHeader = () => (
  <div style={{
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏫</div>
    <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#f0f9ff' }}>
      Faculty System
    </h2>
  </div>
);

export default Sidebar;

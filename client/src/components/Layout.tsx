import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Search,
  MessageSquare,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/dashboard', label: '部门看板', icon: LayoutDashboard },
  { path: '/my-report', label: '我的月报', icon: FileText },
  { path: '/report-query', label: '月报查询', icon: Search },
  { path: '/review', label: '管理评审', icon: MessageSquare },
  { path: '/staff', label: '人员管理', icon: Users },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentPage = menuItems.find((item) => location.pathname.startsWith(item.path));

  return (
    <div className="flex h-screen bg-slate-50">
      <aside
        className={cn(
          'flex flex-col bg-white border-r border-slate-200 transition-all duration-300',
          sidebarOpen ? 'w-[220px]' : 'w-0 overflow-hidden'
        )}
      >
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800">运营月报</h1>
              <p className="text-xs text-slate-500">Monthly Report</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">运</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">运营中心</p>
              <p className="text-xs text-slate-500">世和基因</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-500">
                <span>运营月报系统</span>
                <span>/</span>
                <span className="text-slate-700">{currentPage?.label || ''}</span>
              </nav>
              <h2 className="text-lg font-semibold text-slate-800 mt-0.5">
                {currentPage?.label || ''}
              </h2>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Truck, 
  DollarSign, 
  LogOut,
  ChevronRight,
  Plus
} from 'lucide-react';
import { RootState } from '../../lib/store';
import { logoutUser } from '../../lib/slices/authSlice';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  to, 
  active, 
  collapsed 
}: { 
  icon: any, 
  label: string, 
  to: string, 
  active: boolean,
  collapsed: boolean
}) => (
    <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
      active 
        ? "bg-[#7C2D12]/20 text-white font-bold" 
        : "text-white/80 hover:bg-[#7C2D12]/10 hover:text-white"
    )}
  >
    <Icon className="h-5 w-5 shrink-0" />
    {!collapsed && <span className="truncate">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap font-bold">
        {label}
      </div>
    )}
  </Link>
);

const SidebarGroup = ({ 
  label, 
  children, 
  collapsed 
}: { 
  label: string, 
  children: React.ReactNode, 
  collapsed: boolean 
}) => (
  <div className="mb-6">
    {!collapsed && (
      <h3 className="px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
        {label}
      </h3>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  
  const isCollapsed = !sidebarOpen;

  const isActive = (path: string) => location.pathname === path;
  const startsWith = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className={cn(
      "sticky top-0 h-screen bg-primary transition-all duration-300 flex flex-col shadow-2xl z-40",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="h-20 flex items-center px-6">
        <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
          <Package className="text-primary h-6 w-6" />
        </div>
        {!isCollapsed && <span className="ml-3 font-black text-xl tracking-tighter text-white uppercase">WorkShop ERP</span>}
      </div>

      <div className="flex-1 overflow-y-auto py-6 scrollbar-hide px-3">
        <SidebarGroup label="Main" collapsed={isCollapsed}>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            to="/dashboard" 
            active={isActive('/dashboard')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={Package} 
            label="Inventory" 
            to="/dashboard/inventory" 
            active={isActive('/dashboard/inventory')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={ShoppingCart} 
            label="Sales Orders" 
            to="/dashboard/sales" 
            active={isActive('/dashboard/sales')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={Users} 
            label="Users" 
            to="/dashboard/users" 
            active={isActive('/dashboard/users')} 
            collapsed={isCollapsed} 
          />
        </SidebarGroup>

        <SidebarGroup label="Modules" collapsed={isCollapsed}>
          <SidebarItem 
            icon={Users} 
            label="Customers" 
            to="/dashboard/modules/customer" 
            active={startsWith('/dashboard/modules/customer')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Quotations" 
            to="/dashboard/modules/quotation" 
            active={startsWith('/dashboard/modules/quotation')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={ShoppingCart} 
            label="Purchase Orders" 
            to="/dashboard/modules/purchase-order" 
            active={startsWith('/dashboard/modules/purchase-order')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={Package} 
            label="Material Inward" 
            to="/dashboard/modules/material-inward" 
            active={startsWith('/dashboard/modules/material-inward')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={Truck} 
            label="Material Dispatch" 
            to="/dashboard/modules/material-dispatch" 
            active={startsWith('/dashboard/modules/material-dispatch')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={DollarSign} 
            label="Job Costing" 
            to="/dashboard/modules/job-costing" 
            active={startsWith('/dashboard/modules/job-costing')} 
            collapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Invoices" 
            to="/dashboard/modules/invoice" 
            active={startsWith('/dashboard/modules/invoice')} 
            collapsed={isCollapsed} 
          />
        </SidebarGroup>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#7C2D12]/10">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-1">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary font-black text-sm">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-white leading-tight truncate">Admin User</p>
              <p className="text-xs text-white/60 truncate">Production Mgr.</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => dispatch(logoutUser() as any)}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon"
            className="w-full text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => dispatch(logoutUser() as any)}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </aside>
  );
}

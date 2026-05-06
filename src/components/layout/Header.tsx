import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Bell, 
  Menu, 
  Plus
} from 'lucide-react';
import { toggleSidebar } from '../../lib/slices/uiSlice';
import { Button } from '../ui/button';

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { title: 'Dashboard Overview', sub: 'Manufacturing Performance Tracking' };
    if (path.includes('inventory')) return { title: 'Inventory Control', sub: 'Stock Level & Warehouse Management' };
    if (path.includes('customer')) return { title: 'Customer Relations', sub: 'Client Directory & History' };
    if (path.includes('quotation')) return { title: 'Quotation Engine', sub: 'Price Estimation & Proposal Tool' };
    if (path.includes('sales')) return { title: 'Sales Tracking', sub: 'Order Management & Pipeline' };
    if (path.includes('users')) return { title: 'User Management', sub: 'Team Roles & Permissions' };
    return { title: 'WorkShop ERP', sub: 'Integrated Manufacturing Solution' };
  };

  const { title, sub } = getPageTitle();

  return (
    <header className="h-20 border-b border-border px-8 flex items-center justify-between sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => dispatch(toggleSidebar())}
          className="text-primary hover:bg-secondary/50"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden sm:block">
          <h2 className="text-2xl font-black tracking-tighter leading-none">{title}</h2>
          <p className="text-sm opacity-60 font-medium mt-1">{sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-primary hover:bg-secondary/50 rounded-full h-10 w-10">
          <Bell className="h-6 w-6" />
        </Button>
        
        <div className="h-8 w-[1px] bg-border mx-2" />
        
        <Button 
          onClick={() => navigate('/dashboard/modules/quotation/new')}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform gap-2"
        >
          <Plus className="h-4 w-4" /> Create Quotation
        </Button>
      </div>
    </header>
  );
}

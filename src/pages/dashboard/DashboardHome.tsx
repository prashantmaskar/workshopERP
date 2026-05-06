import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  FileText, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
  { name: 'Aug', value: 4000 },
  { name: 'Sep', value: 3000 },
  { name: 'Oct', value: 2000 },
  { name: 'Nov', value: 2780 },
  { name: 'Dec', value: 3890 },
];

const inventoryData = [
  { name: 'Raw Material', value: 85, color: '#F97316' },
  { name: 'Finished Goods', value: 42, color: '#60A5FA' },
  { name: 'WIP Inventory', value: 68, color: '#FACC15' },
];

const categoryData = [
  { name: 'Raw Material', value: 400 },
  { name: 'Finished Goods', value: 300 },
  { name: 'MRO', value: 300 },
  { name: 'Packaging', value: 200 },
];

const COLORS = ['#F97316', '#60A5FA', '#FACC15', '#7C2D12'];

const StatCard = ({ title, value, icon: Icon, description, trend, trendValue, trendColor }: any) => (
  <Card className="rounded-3xl border-border bg-white shadow-sm overflow-hidden border transition-all hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex flex-col space-y-1">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em] mb-1">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-black tracking-tighter text-foreground">{value}</h3>
          {trend && (
            <span className={cn(
              "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight",
              trendColor === 'green' ? "bg-green-100 text-green-700" : 
              trendColor === 'blue' ? "bg-blue-100 text-blue-700" :
              "bg-orange-100 text-orange-700"
            )}>
              {trend === 'up' ? `+${trendValue}%` : trend === 'down' ? `-${trendValue}%` : trendValue}
            </span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value="1,284" 
          icon={Users} 
          trend="up"
          trendValue="12.5"
          trendColor="green"
        />
        <StatCard 
          title="Sales Revenue" 
          value="₹42.8L" 
          icon={ShoppingCart} 
          trend="up"
          trendValue="8.2"
          trendColor="green"
        />
        <StatCard 
          title="Active Jobs" 
          value="14" 
          icon={FileText} 
          trend="warning"
          trendValue="Warning"
          trendColor="orange"
        />
        <StatCard 
          title="Open Quotes" 
          value="128" 
          icon={Package} 
          trend="stable"
          trendValue="Stable"
          trendColor="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-3xl border-border bg-white shadow-sm border p-4">
          <CardHeader className="p-2 pb-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-black tracking-tight">Sales Trend</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">Revenue Performance 2026</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Revenue</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[240px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FED7AA" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontWeight: 800, fill: '#7C2D12', opacity: 0.4 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #FED7AA', padding: '12px', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.1)' }}
                  itemStyle={{ fontWeight: 900, color: '#F97316' }}
                  labelStyle={{ fontWeight: 900, color: '#7C2D12', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F97316" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-white shadow-sm border p-4">
          <CardHeader className="p-2 pb-6">
            <CardTitle className="text-lg font-black tracking-tight">Inventory Status</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">Category Distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2 flex flex-col gap-6">
            {inventoryData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="opacity-60 uppercase tracking-widest">{item.name}</span>
                  <span className="text-foreground">{item.value}%</span>
                </div>
                <div className="w-full h-3 bg-secondary/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-4 bg-secondary/10 flex justify-between items-center border-b border-border">
          <h4 className="font-black text-lg tracking-tight">Recent Quotations</h4>
          <Button 
            variant="link" 
            className="text-xs font-black text-primary p-0 h-auto hover:no-underline"
            onClick={() => navigate('/dashboard/modules/quotation')}
          >
            View All Transactions
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">
                  <th className="px-8 py-4 border-b border-border">Quote #</th>
                  <th className="px-8 py-4 border-b border-border">Customer</th>
                  <th className="px-8 py-4 border-b border-border">Part Name</th>
                  <th className="px-8 py-4 border-b border-border">Amount</th>
                  <th className="px-8 py-4 border-b border-border">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                  {[
                    { id: '1', quoteNo: 'QTN/2026/0012', customer: 'Precision Machining Inc.', part: 'Gasket Seal V3', amount: '₹12,450', status: 'SENT', statusColor: 'green' },
                    { id: '2', quoteNo: 'QTN/2026/0013', customer: 'Tata Steel Solutions', part: 'Brake Caliper X9', amount: '₹85,200', status: 'DRAFT', statusColor: 'orange' },
                    { id: '3', quoteNo: 'QTN/2026/0014', customer: 'AeroSpace Dynamics', part: 'Titanium Bracket', amount: '₹4,25,000', status: 'ACCEPTED', statusColor: 'blue' },
                    { id: '4', quoteNo: 'QTN/2026/0015', customer: 'Global Motors', part: 'Cylinder Head', amount: '₹1,12,000', status: 'SENT', statusColor: 'green' },
                  ].map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-background/50 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/dashboard/modules/quotation/${item.id}/view`)}
                    >
                      <td className="px-8 py-4 font-black text-xs text-primary">{item.quoteNo}</td>
                    <td className="px-8 py-4 font-bold">{item.customer}</td>
                    <td className="px-8 py-4 opacity-60">{item.part}</td>
                    <td className="px-8 py-4 font-black">{item.amount}</td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        item.statusColor === 'green' ? "bg-green-100 text-green-700" :
                        item.statusColor === 'orange' ? "bg-orange-100 text-orange-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(' ');
}

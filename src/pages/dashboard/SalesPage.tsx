import { useState } from 'react';
import { Search, ShoppingCart, MoreHorizontal, FileText } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../lib/utils';

const mockSales = [
  { id: 'ORD-2024-001', customer: 'ABC Manufacturing', date: '2024-05-01', status: 'Completed', amount: '₹1,24,500' },
  { id: 'ORD-2024-002', customer: 'Global Tech', date: '2024-05-02', status: 'Processing', amount: '₹85,320' },
  { id: 'ORD-2024-003', customer: 'Precision Parts', date: '2024-05-03', status: 'Pending', amount: '₹42,000' },
  { id: 'ORD-2024-004', customer: 'Metal Works Corp', date: '2024-05-04', status: 'Completed', amount: '₹2,15,600' },
  { id: 'ORD-2024-005', customer: 'Sunrise Exports', date: '2024-05-05', status: 'Cancelled', amount: '₹12,000' },
];

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-6 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
          <div>
            <h4 className="font-black text-xl tracking-tight">Sales Pipeline</h4>
            <p className="text-xs font-medium uppercase tracking-widest opacity-60 mt-1">Track and manage your customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-60" />
              <Input 
                placeholder="Search order ID or customer..." 
                className="pl-9 rounded-xl border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="rounded-xl h-10 w-10 p-0 text-primary bg-white border border-border hover:bg-secondary/20">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Order Number</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Customer Name</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Order Date</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Total Amount</TableHead>
                <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map((order) => (
                <TableRow key={order.id} className="hover:bg-background/50 transition-colors group border-b border-border/50 last:border-0">
                  <TableCell className="px-8 py-4 font-black text-xs text-primary">{order.id}</TableCell>
                  <TableCell className="font-black text-sm">{order.customer}</TableCell>
                  <TableCell className="text-xs font-bold opacity-40">{order.date}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      order.status === 'Completed' ? "bg-green-100 text-green-700" :
                      order.status === 'Processing' ? "bg-blue-100 text-blue-700" :
                      order.status === 'Cancelled' ? "bg-red-100 text-red-700" :
                      "bg-orange-100 text-orange-700"
                    )}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-black text-foreground">{order.amount}</TableCell>
                  <TableCell className="px-8 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

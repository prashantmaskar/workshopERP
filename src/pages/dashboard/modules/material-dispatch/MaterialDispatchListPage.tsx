import { useState } from 'react';
import { Search, Plus, Truck, Eye, FileText, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../../components/ui/table';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Card, CardContent } from '../../../../components/ui/card';
import { cn } from '../../../../lib/utils';

const mockDispatches = [
  { id: 'DSP-2024-001', customer: 'ABC Manufacturing', date: '2024-05-01', item: 'Engine Shaft', qty: '100 nos', status: 'Shipped' },
  { id: 'DSP-2024-002', customer: 'Global Motors', date: '2024-05-05', item: 'Cylinder Head', qty: '50 nos', status: 'In Transit' },
];

export default function MaterialDispatchListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredItems = mockDispatches.filter(item => 
    (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.customer && item.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-6 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
          <div>
            <h4 className="font-black text-xl tracking-tight">Material Dispatch</h4>
            <p className="text-xs font-medium uppercase tracking-widest opacity-60 mt-1">Track outgoing shipments and deliveries</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-60" />
              <Input 
                placeholder="Search dispatches or customers..." 
                className="pl-9 rounded-xl border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate('/dashboard/modules/material-dispatch/new')}
              className="rounded-xl h-10 w-10 p-0 text-primary bg-white border border-border hover:bg-secondary/20 shadow-none shrink-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Dispatch ID</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Customer</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Ship Date</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Item Details</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Status</TableHead>
                <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-background/50 transition-colors group border-b border-border/50 last:border-0">
                  <TableCell className="px-8 py-4 font-black text-xs text-primary">{item.id}</TableCell>
                  <TableCell className="font-black text-sm">{item.customer}</TableCell>
                  <TableCell className="text-xs font-bold opacity-40">{item.date}</TableCell>
                  <TableCell className="text-sm font-medium">{item.item} ({item.qty})</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      item.status === 'Shipped' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                        <Eye className="h-3.5 w-3.5" />
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

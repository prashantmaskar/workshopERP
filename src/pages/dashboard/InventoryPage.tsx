import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Trash2, 
  Edit, 
  Package 
} from 'lucide-react';
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

const mockInventory = [
  { id: '1', sku: 'SKU-001', name: 'Stainless Steel Rod', quantity: 450, warehouse: 'Warehouse A', price: '₹450', status: 'In Stock' },
  { id: '2', sku: 'SKU-002', name: 'Aluminum Plate', quantity: 12, warehouse: 'Warehouse B', price: '₹1,200', status: 'Low Stock' },
  { id: '3', sku: 'SKU-003', name: 'Copper Wire', quantity: 0, warehouse: 'Warehouse A', price: '₹850', status: 'Out of Stock' },
  { id: '4', sku: 'SKU-004', name: 'Brass Fitting', quantity: 890, warehouse: 'Warehouse C', price: '₹120', status: 'In Stock' },
  { id: '5', sku: 'SKU-005', name: 'Iron Beam', quantity: 34, warehouse: 'Warehouse B', price: '₹2,300', status: 'Low Stock' },
  { id: '6', sku: 'SKU-006', name: 'Galvanized Sheet', quantity: 156, warehouse: 'Warehouse A', price: '₹550', status: 'In Stock' },
  { id: '7', sku: 'SKU-007', name: 'Welding Electrode', quantity: 2300, warehouse: 'Warehouse C', price: '₹15', status: 'In Stock' },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-6 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
          <div>
            <h4 className="font-black text-xl tracking-tight">Inventory Catalog</h4>
            <p className="text-xs font-medium uppercase tracking-widest opacity-60 mt-1">Real-time stock monitoring & management</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-60" />
              <Input 
                placeholder="Search SKU or name..." 
                className="pl-9 rounded-xl border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="rounded-xl h-10 w-10 p-0 text-primary bg-white border border-border hover:bg-secondary/20">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">SKU</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Item Name</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Quantity</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Warehouse</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Unit Price</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Status</TableHead>
                <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-background/50 transition-colors group border-b border-border/50 last:border-0">
                  <TableCell className="px-8 py-4 font-black text-xs text-primary">{item.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-black text-sm">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{item.quantity}</TableCell>
                  <TableCell className="text-xs font-bold opacity-40">{item.warehouse}</TableCell>
                  <TableCell className="font-bold">{item.price}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      item.status === 'In Stock' ? "bg-green-100 text-green-700" :
                      item.status === 'Low Stock' ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow key="empty">
                  <TableCell colSpan={7} className="h-40 text-center font-bold opacity-40">
                    No items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Search, Plus, ShoppingCart, Eye, FileText, MoreHorizontal } from 'lucide-react';
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
import { purchaseOrderService } from '../../../../services/api';

export default function PurchaseOrderListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pos, setPos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const response = await purchaseOrderService.getAll();
        setPos(response.data);
      } catch (error) {
        console.error('Failed to fetch POs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPOs();
  }, []);

  const filteredItems = pos.filter(item => 
    (item.poNumber && item.poNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.supplierName && item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-6 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
          <div>
            <h4 className="font-black text-xl tracking-tight">Purchase Pipeline</h4>
            <p className="text-xs font-medium uppercase tracking-widest opacity-60 mt-1">Manage and track your procurement orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-60" />
              <Input 
                placeholder="Search POs or suppliers..." 
                className="pl-9 rounded-xl border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="rounded-xl h-10 w-10 p-0 text-primary bg-white border border-border hover:bg-secondary/20 shadow-none shrink-0"
              onClick={() => navigate('/dashboard/modules/purchase-order/new')}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center font-black opacity-40 uppercase tracking-widest">Initialising Order data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                  <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">PO Number</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Supplier Partner</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Issued Date</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Order Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Total Value</TableHead>
                  <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((po) => (
                  <TableRow key={po._id} className="hover:bg-background/50 transition-colors group border-b border-border/50 last:border-0">
                    <TableCell className="px-8 py-4 font-black text-xs text-primary">{po.poNumber}</TableCell>
                    <TableCell className="font-black text-sm">{po.supplierName}</TableCell>
                    <TableCell className="text-xs font-bold opacity-40">{new Date(po.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        po.status === 'Sent' ? "bg-green-100 text-green-700" :
                        po.status === 'Received' ? "bg-blue-100 text-blue-700" :
                        po.status === 'Cancelled' ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      )}>
                        {po.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-black text-foreground">₹{po.totalAmount?.toLocaleString()}</TableCell>
                    <TableCell className="px-8 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

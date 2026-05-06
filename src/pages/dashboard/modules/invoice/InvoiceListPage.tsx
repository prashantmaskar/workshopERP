import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Eye, Download, MoreHorizontal } from 'lucide-react';
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
import { financeService } from '../../../../services/api';

export default function InvoiceListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await financeService.getInvoices();
        setInvoices(response.data);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredItems = invoices.filter(item => 
    (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.customerName && item.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-6 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
          <div>
            <h4 className="font-black text-xl tracking-tight">Invoice Repository</h4>
            <p className="text-xs font-medium uppercase tracking-widest opacity-60 mt-1">Manage billing and payment status</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-60" />
              <Input 
                placeholder="Search invoices or customers..." 
                className="pl-9 rounded-xl border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate('/dashboard/modules/invoice/new')}
              className="rounded-xl h-10 w-10 p-0 text-primary bg-white border border-border hover:bg-secondary/20 shadow-none shrink-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-12 text-center font-black opacity-40 uppercase tracking-widest">Initialising billing records...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                  <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Invoice Number</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Customer Name</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Invoice Date</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Amount Due</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Status</TableHead>
                  <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id} className="hover:bg-background/50 transition-colors group border-b border-border/50 last:border-0">
                    <TableCell className="px-8 py-4 font-black text-xs text-primary">{item.invoiceNumber}</TableCell>
                    <TableCell className="font-black text-sm">{item.customerName}</TableCell>
                    <TableCell className="text-xs font-bold opacity-40">{new Date(item.invoiceDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-black text-foreground">₹{item.totalAmount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        item.status === 'Paid' ? "bg-green-100 text-green-700" : 
                        item.status === 'Overdue' ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
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
                          <Download className="h-3.5 w-3.5" />
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

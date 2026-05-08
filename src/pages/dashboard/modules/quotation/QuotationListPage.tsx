import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  FileDown 
} from 'lucide-react';
import { useQuotation } from '../../../../hooks/useQuotation';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../../components/ui/dropdown-menu';
import { cn } from '../../../../lib/utils';

export default function QuotationListPage() {
  const navigate = useNavigate();
  const { items, loading, fetchQuotations } = useQuotation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const filteredItems = items.filter(item => 
    (item.quoteNo && item.quoteNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.customer && item.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-6 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
          <div>
            <h4 className="font-black text-xl tracking-tight">Quotations Directory</h4>
            <p className="text-xs font-medium uppercase tracking-widest opacity-60 mt-1">Manage and track your product price quotes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-60" />
              <Input 
                placeholder="Search quotes or customers..." 
                className="pl-9 rounded-xl border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate('/dashboard/modules/quotation/new')}
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
                <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Quote Number</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Customer</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Part Name</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Attained By</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Date</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Total</TableHead>
                <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && items.length === 0 ? (
                <TableRow key="loading">
                  <TableCell colSpan={7} className="h-40 text-center font-bold opacity-40">Loading data...</TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow key="empty">
                  <TableCell colSpan={7} className="h-40 text-center font-bold opacity-40">No quotations found.</TableCell>
                </TableRow>
              ) : (
                filteredItems.map((quote) => (
                  <TableRow 
                    key={quote.id} 
                    className="hover:bg-background/50 transition-colors group border-b border-border/50 last:border-0 cursor-pointer"
                    onClick={() => navigate(`/dashboard/modules/quotation/${quote.id}/view`)}
                  >
                    <TableCell className="px-8 py-4 font-black text-xs text-primary">{quote.quoteNo}</TableCell>
                    <TableCell className="font-black text-sm">{quote.customer}</TableCell>
                    <TableCell className="text-sm font-medium opacity-80">{quote.partName}</TableCell>
                    <TableCell className="text-xs font-bold opacity-40">{quote.attainedBy}</TableCell>
                    <TableCell className="text-xs font-bold opacity-40">{quote.date}</TableCell>
                    <TableCell className="font-black text-foreground">₹{quote.total}</TableCell>
                    <TableCell className="px-8 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                          onClick={() => navigate(`/dashboard/modules/quotation/${quote.id}/view`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={cn("inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors cursor-pointer outline-none")}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-border p-1">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/dashboard/modules/quotation/${quote.id}/view`)}
                              className="rounded-lg gap-2 cursor-pointer font-bold text-xs"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs text-primary">
                              <FileDown className="h-3.5 w-3.5" /> Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

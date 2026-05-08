import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Mail, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2,
  User,
  Calendar,
  Layers,
  Settings,
  Loader2
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { cn } from '../../../../lib/utils';
import { quotationService } from '../../../../services/api';

export default function QuotationViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await quotationService.getById(id!);
        setQuote(response.data);
      } catch (error) {
        console.error('Error fetching quotation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Quotation not found</h2>
        <Button onClick={() => navigate('/dashboard/modules/quotation')} className="mt-4">
          Back to List
        </Button>
      </div>
    );
  }

  const calculateOpAmount = (op: any) => {
    if (op.amount !== undefined && op.amount > 0) return Number(op.amount);
    const rate = op.rate || 0;
    const time = op.timeSeconds || 0;
    return (rate / 3600) * time;
  };
  
  const totalOpsAmount = (quote.operations || []).reduce((sum: number, op: any) => 
    sum + calculateOpAmount(op), 0
  );

  const scrapWeight = Math.max(0, (quote.materialDetails?.inputWeight || 0) - (quote.materialDetails?.finishWeight || 0));
  const scrapValue = (scrapWeight / 1000) * (quote.materialDetails?.scrapRate || 0) * ((quote.materialDetails?.scrapRecovery || 0) / 100);
  
  const subTotal = totalOpsAmount - scrapValue;
  const profitAmount = subTotal * ((quote.materialDetails?.profitPercent || 0) / 100);
  const finalTotal = subTotal + profitAmount;

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="rounded-xl border-border bg-white text-primary hover:bg-secondary/20 h-12 w-12"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tighter text-foreground">{quote.quoteNo}</h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                quote.status === 'Sent' ? "bg-green-100 text-green-700" :
                quote.status === 'Draft' ? "bg-orange-100 text-orange-700" :
                "bg-blue-100 text-blue-700"
              )}>
                {quote.status}
              </span>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Official Manufacturing Quotation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl gap-2 font-black text-xs uppercase tracking-widest border-border bg-white h-12 px-6">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 font-black text-xs uppercase tracking-widest border-border bg-white h-12 px-6" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button className="rounded-xl gap-2 font-black text-xs uppercase tracking-widest bg-primary h-12 px-6 shadow-lg shadow-primary/20">
            <Mail className="h-4 w-4" /> Send Email
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Document Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-border bg-white shadow-xl border overflow-hidden">
            <div className="p-12 space-y-12">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b border-border pb-12">
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
                    <Settings className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter text-primary">ERP FORGE TECH</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Industrial Manufacturing Solutions</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Issue Date</p>
                  <p className="text-lg font-black">{new Date(quote.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Client & Part Details */}
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Quoted To</p>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black tracking-tight">{quote.customerName}</h4>
                    <p className="text-sm font-medium opacity-60">Manufacturing Division</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Component Specification</p>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black tracking-tight text-primary">{quote.partName}</h4>
                    <p className="text-sm font-medium opacity-60">Attained By: {quote.attainedName}</p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">In Wt</p>
                        <p className="text-sm font-bold">{quote.materialDetails?.inputWeight}g</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">Out Wt</p>
                        <p className="text-sm font-bold">{quote.materialDetails?.finishWeight}g</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">Total Wt</p>
                        <p className="text-sm font-bold">{(quote.materialDetails?.inputWeight || 0) - (quote.materialDetails?.finishWeight || 0)}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Table */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Manufacturing Workflow</p>
                <div className="rounded-3xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/10 hover:bg-secondary/10 border-b border-border">
                        <TableHead className="px-8 py-4 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Step</TableHead>
                        <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Labor Rate</TableHead>
                        <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Cycle Time</TableHead>
                        <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.operations?.map((op: any, idx: number) => (
                        <TableRow key={idx} className="border-b border-border/50 last:border-0 h-16">
                          <td className="px-8 font-black text-xs">{op.operationName}</td>
                          <td className="font-bold text-xs opacity-60">₹{op.rate}/hr</td>
                          <td className="font-bold text-xs opacity-60">{op.timeSeconds} sec</td>
                          <td className="px-8 text-right font-black text-sm">₹{calculateOpAmount(op).toFixed(2)}</td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Summary Calculations */}
              <div className="flex justify-end pt-8">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase tracking-widest opacity-40">Operations Total</span>
                    <span className="font-black">₹{totalOpsAmount.toFixed(2)}</span>
                  </div>
                  {quote.materialDetails?.showScrapInReport !== false && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black uppercase tracking-widest opacity-40">Scrap Credit ({scrapWeight}g)</span>
                      <span className="font-black text-green-600">-₹{scrapValue.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="h-px bg-border my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest opacity-40">Subtotal</span>
                    <span className="text-lg font-black">₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase tracking-widest opacity-40">Profit Margin ({quote.materialDetails?.profitPercent}%)</span>
                    <span className="font-black text-primary">₹{profitAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-6">
                    <div className="bg-primary text-white p-6 rounded-3xl space-y-1 shadow-xl shadow-primary/20">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Quotation Value</p>
                      <h3 className="text-4xl font-black tracking-tighter">₹{finalTotal.toFixed(2)}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-border bg-white shadow-sm border p-8 space-y-8">
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60 mb-6">Quote Status</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none">Draft Created</p>
                    <p className="text-[10px] font-bold opacity-40 mt-1">{new Date(quote.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none">Current Status</p>
                    <p className="text-[10px] font-bold opacity-40 mt-1">{quote.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Button variant="outline" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]" onClick={() => navigate(`/dashboard/modules/quotation/${id}/edit`)}>
            Edit Quotation
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
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
  Settings
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { cn } from '../../../../lib/utils';

// Mock data fetch - in real app, fetch by id
const getMockQuote = (id: string) => {
  return {
    id,
    quoteNo: `QTN/2026/${id.padStart(4, '0')}`,
    customer: 'Precision Machining Inc.',
    attainedBy: 'John Doe',
    partName: 'Gasket Seal V3',
    date: '2026-05-01',
    status: 'SENT',
    materialDetails: {
      inputWeightGrams: 450,
      finishWeightGrams: 380,
      scrapRecoveryPercent: 95,
      scrapRate: 85,
      profitPercent: 15
    },
    operations: [
      { name: 'CNC Milling', ratePerHour: 1200, timeInSeconds: 120 },
      { name: 'Surface Grinding', ratePerHour: 800, timeInSeconds: 60 },
      { name: 'Deburring', ratePerHour: 400, timeInSeconds: 30 }
    ]
  };
};

export default function QuotationViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quote = getMockQuote(id || '0012');

  const calculateOpAmount = (rate: number, time: number) => (rate / 3600) * time;
  
  const totalOpsAmount = quote.operations.reduce((sum, op) => 
    sum + calculateOpAmount(op.ratePerHour, op.timeInSeconds), 0
  );

  const scrapWeight = Math.max(0, quote.materialDetails.inputWeightGrams - quote.materialDetails.finishWeightGrams);
  const scrapValue = (scrapWeight / 1000) * quote.materialDetails.scrapRate * (quote.materialDetails.scrapRecoveryPercent / 100);
  
  const subTotal = totalOpsAmount - scrapValue;
  const profitAmount = subTotal * (quote.materialDetails.profitPercent / 100);
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
                quote.status === 'SENT' ? "bg-green-100 text-green-700" :
                quote.status === 'DRAFT' ? "bg-orange-100 text-orange-700" :
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
                    <h2 className="text-2xl font-black tracking-tighter">OMNI PRECISION</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Manufacturing & Engineering Solutions</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Issue Date</p>
                  <p className="text-lg font-black">{quote.date}</p>
                  <div className="pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Valid Until</p>
                    <p className="text-sm font-bold">2026-06-01</p>
                  </div>
                </div>
              </div>

              {/* Client & Part Details */}
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Quoted To</p>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black tracking-tight">{quote.customer}</h4>
                    <p className="text-sm font-medium opacity-60">Manufacturing Division</p>
                    <p className="text-sm opacity-60">Plot 124, Industrial Area Phase II,</p>
                    <p className="text-sm opacity-60">Chakan, Pune 410501</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Component Specification</p>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black tracking-tight text-primary">{quote.partName}</h4>
                    <p className="text-sm font-medium opacity-60">Attained By: {quote.attainedBy}</p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">In Wt</p>
                        <p className="text-sm font-bold">{quote.materialDetails.inputWeightGrams}g</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">Out Wt</p>
                        <p className="text-sm font-bold">{quote.materialDetails.finishWeightGrams}g</p>
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
                        <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.operations.map((op, idx) => (
                        <TableRow key={idx} className="border-b border-border/50 last:border-0 h-16">
                          <td className="px-8 font-black text-xs">{op.name}</td>
                          <td className="font-bold text-xs opacity-60">₹{op.ratePerHour}/hr</td>
                          <td className="font-bold text-xs opacity-60">{op.timeInSeconds} sec</td>
                          <td className="px-8 text-right font-black text-sm">₹{calculateOpAmount(op.ratePerHour, op.timeInSeconds).toFixed(2)}</td>
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
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase tracking-widest opacity-40">Scrap Credit ({scrapWeight}g)</span>
                    <span className="font-black text-green-600">-₹{scrapValue.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest opacity-40">Subtotal</span>
                    <span className="text-lg font-black">₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase tracking-widest opacity-40">Profit Margin ({quote.materialDetails.profitPercent}%)</span>
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
                    <p className="text-xs font-black uppercase tracking-widest leading-none">Quote Created</p>
                    <p className="text-[10px] font-bold opacity-40 mt-1">May 1, 2026 • 10:45 AM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none">Sent to Customer</p>
                    <p className="text-[10px] font-bold opacity-40 mt-1">May 2, 2026 • 02:30 PM</p>
                  </div>
                </div>
                <div className="flex gap-4 opacity-40">
                  <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none">Awaiting Acceptance</p>
                    <p className="text-[10px] font-bold mt-1">Pending verification</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60 mb-4">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Items</p>
                  <p className="text-xl font-black">12</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Ops</p>
                  <p className="text-xl font-black">{quote.operations.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Button variant="outline" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]">
            Edit Quotation
          </Button>
        </div>
      </div>
    </div>
  );
}

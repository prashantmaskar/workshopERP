import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calculator, 
  CheckCircle2, 
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';
import { useQuotation } from '../../../../hooks/useQuotation';
import { useCustomer } from '../../../../hooks/useCustomer';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

const operationSchema = z.object({
  operationName: z.string().min(1, "Required"),
  rate: z.coerce.number().min(0),
  timeSeconds: z.coerce.number().min(0),
});

const quotationSchema = z.object({
  quoteNo: z.string(),
  customerId: z.string().min(1, "Required"),
  customerName: z.string().optional(),
  attainedName: z.string().min(1, "Required"),
  mobile: z.string().optional(),
  partName: z.string().min(1, "Required"),
  partNumber: z.string().optional(),
  operations: z.array(operationSchema),
  materialDetails: z.object({
    inputWeight: z.coerce.number().min(0),
    finishWeight: z.coerce.number().min(0),
    scrapRecovery: z.coerce.number().min(0).max(100),
    scrapRate: z.coerce.number().min(0),
    profitPercent: z.coerce.number().min(0),
  })
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

export default function QuotationFormPage() {
  const navigate = useNavigate();
  const { createQuotation, loading } = useQuotation();
  const { items: customers, fetchCustomers } = useCustomer();
  
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<any>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      quoteNo: `PI/QTN/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      attainedName: 'John Admin',
      operations: [{ operationName: 'Milling', rate: 450, timeSeconds: 120 }],
      materialDetails: {
        inputWeight: 0,
        finishWeight: 0,
        scrapRecovery: 0,
        scrapRate: 0,
        profitPercent: 15,
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "operations"
  });

  const watchedOperations = watch("operations");
  const watchedMaterial = watch("materialDetails");

  // Calculations
  const calculateOpAmount = (rate: number, time: number) => {
    return Number(((rate / 3600) * time).toFixed(2));
  };

  const totalOpsAmount = watchedOperations.reduce((sum, op) => {
    return sum + calculateOpAmount(op.rate, op.timeSeconds);
  }, 0 || 0);

  const scrapWeight = Math.max(0, (watchedMaterial?.inputWeight || 0) - (watchedMaterial?.finishWeight || 0));
  const scrapValue = (scrapWeight / 1000) * (watchedMaterial?.scrapRate || 0) * ((watchedMaterial?.scrapRecovery || 0) / 100);
  
  const subTotal = totalOpsAmount - scrapValue;
  const profitAmount = subTotal * ((watchedMaterial?.profitPercent || 0) / 100);
  const finalTotal = subTotal + profitAmount;

  const onSubmit = async (data: QuotationFormValues) => {
    const selectedCustomer = customers.find(c => c.id === data.customerId);
    await createQuotation({ ...data, customerName: selectedCustomer?.name, total: finalTotal.toFixed(2) });
    navigate('/dashboard/modules/quotation');
  };

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto pb-32">
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
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Draft New Quote</h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Configure manufacturing operations and material costs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Primary Metadata</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Quote ID</Label>
                <Input {...register('quoteNo')} readOnly className="bg-secondary/20 font-black text-xs h-12 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Customer Partner</Label>
                <Select onValueChange={(val) => setValue('customerId', val)}>
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id} className="font-bold text-xs">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Attained Name</Label>
                <Input {...register('attainedName')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Mobile Number</Label>
                <Input {...register('mobile')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Part Specification</Label>
                <Input {...register('partName')} placeholder="e.g. Compression Valve" className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Part Number</Label>
                <Input {...register('partNumber')} placeholder="e.g. PN-1234" className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 flex items-center justify-between border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Operational Workflow</h4>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ operationName: '', rate: 0, timeSeconds: 0 })} className="rounded-lg h-8 px-4 border-primary text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5">
                <Plus className="h-3 w-3 mr-2" /> Add Step
              </Button>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                    <TableHead className="px-8 py-4 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Operation</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Rate/Hr</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Time (Sec)</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Amount</TableHead>
                    <TableHead className="px-8 border-b border-border"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id} className="border-b border-border last:border-0 group">
                      <TableCell className="px-8 py-4">
                        <Input {...register(`operations.${index}.operationName` as const)} placeholder="Operation..." className="h-10 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" {...register(`operations.${index}.rate` as const)} className="h-10 w-24 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" {...register(`operations.${index}.timeSeconds` as const)} className="h-10 w-24 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell className="font-black text-xs">
                        ₹{calculateOpAmount(watchedOperations[index]?.rate || 0, watchedOperations[index]?.timeSeconds || 0)}
                      </TableCell>
                      <TableCell className="px-8">
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Material Metrics</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Input Wt (g)</Label>
                <Input type="number" {...register('materialDetails.inputWeight')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Finish Wt (g)</Label>
                <Input type="number" {...register('materialDetails.finishWeight')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Scrap Recovery %</Label>
                <Input type="number" {...register('materialDetails.scrapRecovery')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Scrap Rate (₹/kg)</Label>
                <Input type="number" {...register('materialDetails.scrapRate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Profit Margin %</Label>
                <Input type="number" {...register('materialDetails.profitPercent')} className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg rounded-[2.5rem] p-4 sticky top-24">
            <CardHeader className="pt-8 px-6">
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Quote Summary</CardTitle>
              <CardDescription className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Real-time Financials</CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-4 pt-4">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Ops Total</span>
                <span className="font-black">₹{totalOpsAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Scrap Credit</span>
                <span className="font-black text-green-300">-₹{scrapValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-black/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60 text-primary-foreground">Sub-Total</span>
                <span className="font-black">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60 text-primary-foreground">Profit ({watchedMaterial?.profitPercent}%)</span>
                <span className="font-black">₹{profitAmount.toFixed(2)}</span>
              </div>
              
              <div className="pt-8 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Final Quotation Value</p>
                <h2 className="text-5xl font-black tracking-tighter">₹{finalTotal.toFixed(2)}</h2>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl" disabled={loading}>
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <> <Save className="h-5 w-5 mr-3" /> Commit Quote </>}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate(-1)}>
                Discard Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

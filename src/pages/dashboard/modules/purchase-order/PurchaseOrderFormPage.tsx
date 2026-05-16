import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calculator, 
  RefreshCw,
  X,
  ShoppingCart
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

import { purchaseOrderService } from '../../../../services/api';

import { useQuotation } from '../../../../hooks/useQuotation';

interface POItem {
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unit: string;
}

interface OperationItem {
  name: string;
  programNo: string;
  cycleTime: string;
}

interface POFormValues {
  poNumber: string;
  quotationId?: string;
  orderDate: string;
  customerName: string;
  attendee: string;
  partName: string;
  partNumber: string;
  hsnCode: string;
  sgst: number;
  cgst: number;
  igst: number;
  operations: OperationItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  notes: string;
  paymentTerms: 'COD' | '15 Days' | '30 Days' | '45 Days' | 'Advance';
}

const units = ['pcs', 'box', 'kg', 'meter', 'liter'];

export default function PurchaseOrderFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { fetchQuotations, items: quotations } = useQuotation();

  const { register, control, handleSubmit, watch, setValue } = useForm<POFormValues>({
    defaultValues: {
      poNumber: `PO-2026-27-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: new Date().toISOString().split('T')[0],
      operations: [{ name: '', programNo: '', cycleTime: '' }],
      paymentTerms: '30 Days',
      sgst: 9,
      cgst: 9,
      igst: 0,
      customerName: '',
      attendee: '',
      partName: '',
      partNumber: '',
      subtotal: 0
    }
  });

  const { fields: opFields, append: appendOp, remove: removeOp } = useFieldArray({
    control,
    name: "operations"
  });

  React.useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const watchedQuotationId = watch('quotationId');
  React.useEffect(() => {
    if (watchedQuotationId) {
      const q = quotations.find(q => q.id === watchedQuotationId);
      if (q) {
        setValue('customerName', q.customer || '');
        setValue('attendee', q.attainedBy || '');
        setValue('partName', q.partName || '');
        setValue('partNumber', q.partNumber || '');
      }
    }
  }, [watchedQuotationId, quotations, setValue]);

  const watchedSubtotal = watch('subtotal') || 0;
  const watchedSgst = watch('sgst') || 0;
  const watchedCgst = watch('cgst') || 0;
  const watchedIgst = watch('igst') || 0;

  const subTotal = Number(watchedSubtotal);
  const totalTaxPercent = Number(watchedSgst) + Number(watchedCgst) + Number(watchedIgst);
  const taxAmount = subTotal * (totalTaxPercent / 100);
  const finalTotal = subTotal + taxAmount;

  const onSubmit = async (data: POFormValues) => {
    try {
      setLoading(true);
      const submissionData = {
        ...data,
        subtotal: subTotal,
        tax: taxAmount,
        totalAmount: finalTotal
      };
      
      await purchaseOrderService.create(submissionData);
      navigate('/dashboard/modules/purchase-order');
    } catch (error: any) {
      console.error('Failed to create PO:', error);
      alert('Failed to create Purchase Order. Please ensure database is connected and try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Create Purchase Order</h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Issue a new procurement request to vendors</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Order Metadata</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">PO Number</Label>
                <Input {...register('poNumber')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Select Part Number</Label>
                <Select onValueChange={(val: any) => setValue('quotationId', val)}>
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Search Part Number" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {quotations.map(q => (
                      <SelectItem key={q.id} value={q.id} className="font-bold text-xs">{q.partNumber || q.quoteNo} - {q.partName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Customer Name</Label>
                <Input {...register('customerName')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Attendee</Label>
                <Input {...register('attendee')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Part Name</Label>
                <Input {...register('partName')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Part Number</Label>
                <Input {...register('partNumber')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Order Date</Label>
                <Input type="date" {...register('orderDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">HSN Code</Label>
                <Input {...register('hsnCode')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="grid grid-cols-3 gap-2 md:col-span-1">
                <div className="space-y-1">
                  <Label className="text-[8px] font-black uppercase opacity-60">SGST %</Label>
                  <Input type="number" {...register('sgst')} className="h-10 rounded-lg border-border font-bold text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[8px] font-black uppercase opacity-60">CGST %</Label>
                  <Input type="number" {...register('cgst')} className="h-10 rounded-lg border-border font-bold text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[8px] font-black uppercase opacity-60">IGST %</Label>
                  <Input type="number" {...register('igst')} className="h-10 rounded-lg border-border font-bold text-xs" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Payment Terms</Label>
                <Select onValueChange={(val: any) => setValue('paymentTerms', val)} defaultValue="30 Days">
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Terms" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {['COD', '15 Days', '30 Days', '45 Days', 'Advance'].map(term => (
                      <SelectItem key={term} value={term} className="font-bold text-xs">{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Base Order Subtotal (₹)</Label>
                  <Input type="number" {...register('subtotal')} className="h-14 rounded-xl border-border font-black text-2xl text-primary" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Notes</Label>
                <Input {...register('notes')} placeholder="Special instructions..." className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 flex items-center justify-between border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Operation List</h4>
              <Button type="button" size="sm" variant="outline" onClick={() => appendOp({ name: '', programNo: '', cycleTime: '' })} className="rounded-lg h-8 px-4 border-primary text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5">
                <Plus className="h-3 w-3 mr-2" /> Add Operation
              </Button>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                    <TableHead className="px-8 py-4 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Operation Name</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Program No.</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Cycle Time</TableHead>
                    <TableHead className="px-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opFields.map((field, index) => (
                    <TableRow key={field.id} className="border-b border-border last:border-0">
                      <TableCell className="px-8 py-4">
                        <Input {...register(`operations.${index}.name` as const)} placeholder="e.g. Drilling" className="h-10 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell>
                        <Input {...register(`operations.${index}.programNo` as const)} placeholder="PRG-100" className="h-10 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell>
                        <Input {...register(`operations.${index}.cycleTime` as const)} placeholder="120 secs" className="h-10 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell className="px-8">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOp(index)} className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg rounded-[2.5rem] p-4 sticky top-24">
            <CardHeader className="pt-8 px-6">
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Purchase Summary</CardTitle>
              <CardDescription className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Financial Breakdown</CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-4 pt-4">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Subtotal</span>
                <span className="font-black">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Est. Tax ({totalTaxPercent}%)</span>
                <span className="font-black">₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="pt-8 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Grand Total Value</p>
                <h2 className="text-5xl font-black tracking-tighter">₹{finalTotal.toFixed(2)}</h2>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl" disabled={loading}>
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <> <Save className="h-5 w-5 mr-3" /> Commit PO </>}
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

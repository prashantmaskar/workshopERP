import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

import { financeService } from '../../../../services/api';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  total: number;
}

interface InvoiceFormValues {
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  poReference: string;
  lineItems: InvoiceItem[];
  paymentTerms: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  notes: string;
  paidAmount: number;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'Cash';
  status: string;
}

const customers = [
  { id: '1', name: 'ABC Manufacturing' },
  { id: '2', name: 'Global Motors' },
  { id: '3', name: 'Precision Machining Inc.' },
];

const paymentMethods = ['Bank Transfer', 'Cheque', 'Cash'];

export default function InvoiceFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, watch, setValue } = useForm<InvoiceFormValues>({
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, taxPercent: 18, total: 0 }],
      paymentMethod: 'Bank Transfer',
      status: 'Draft',
      paidAmount: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems"
  });

  const watchedItems = watch('lineItems');
  
  const calculateItemTotal = (item: InvoiceItem) => {
    const base = (item.quantity || 0) * (item.unitPrice || 0);
    return base + (base * (item.taxPercent || 0) / 100);
  };

  const subTotal = watchedItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  const totalTax = watchedItems.reduce((sum, item) => {
    const base = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + (base * (item.taxPercent || 0) / 100);
  }, 0);
  const finalTotal = subTotal + totalTax;

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      setLoading(true);
      const selectedCustomer = customers.find(c => c.id === data.customerId);
      const submissionData = {
        ...data,
        customerName: selectedCustomer?.name,
        lineItems: data.lineItems.map(item => ({
          ...item,
          total: calculateItemTotal(item)
        })),
        totalAmount: finalTotal,
        subtotal: subTotal,
        totalTax: totalTax
      };
      
      await financeService.createInvoice(submissionData);
      navigate('/dashboard/modules/invoice');
    } catch (error: any) {
      console.error('Failed to create invoice:', error);
      alert('Failed to generate Invoice. Please ensure database is connected.');
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
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Issue Invoice</h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Create a new commercial invoice for customers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">General Infomation</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Invoice Number</Label>
                <Input {...register('invoiceNumber')} readOnly className="bg-secondary/20 font-black text-xs h-12 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Customer</Label>
                <Select onValueChange={(val: any) => setValue('customerId', val)}>
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
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Invoice Date</Label>
                <Input type="date" {...register('invoiceDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Due Date</Label>
                <Input type="date" {...register('dueDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">PO Reference</Label>
                <Input {...register('poReference')} placeholder="Ref PO #" className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Payment Method</Label>
                <Select onValueChange={(val: any) => setValue('paymentMethod', val)} defaultValue="Bank Transfer">
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {paymentMethods.map(m => (
                      <SelectItem key={m} value={m} className="font-bold text-xs">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Bank Details</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Account Name</Label>
                <Input {...register('bankDetails.accountName')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Account Number</Label>
                <Input {...register('bankDetails.accountNumber')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">IFSC Code</Label>
                <Input {...register('bankDetails.ifscCode')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Bank Name</Label>
                <Input {...register('bankDetails.bankName')} className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 flex items-center justify-between border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Line Items</h4>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxPercent: 18, total: 0 })} className="rounded-lg h-8 px-4 border-primary text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5">
                <Plus className="h-3 w-3 mr-2" /> Add Item
              </Button>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                    <TableHead className="px-8 py-4 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Description</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Qty</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Price</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Tax %</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Total</TableHead>
                    <TableHead className="px-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id} className="border-b border-border last:border-0">
                      <TableCell className="px-8 py-4">
                        <Input {...register(`lineItems.${index}.description` as const)} placeholder="Item..." className="h-10 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" {...register(`lineItems.${index}.quantity` as const)} className="h-10 w-16 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" {...register(`lineItems.${index}.unitPrice` as const)} className="h-10 w-20 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" {...register(`lineItems.${index}.taxPercent` as const)} className="h-10 w-16 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell className="font-black text-xs">
                        ₹{calculateItemTotal(watchedItems[index]).toFixed(2)}
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
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg rounded-[2.5rem] p-4 sticky top-24">
            <CardHeader className="pt-8 px-6">
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Billing Total</CardTitle>
              <CardDescription className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Final Amount Due</CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-4 pt-4">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Subtotal</span>
                <span className="font-black">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Tax</span>
                <span className="font-black">₹{totalTax.toFixed(2)}</span>
              </div>
              
              <div className="pt-8 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Grand Total</p>
                <h2 className="text-5xl font-black tracking-tighter">₹{finalTotal.toFixed(2)}</h2>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl" disabled={loading}>
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <> <Save className="h-5 w-5 mr-3" /> Issue Invoice </>}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate(-1)}>
                Discard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
